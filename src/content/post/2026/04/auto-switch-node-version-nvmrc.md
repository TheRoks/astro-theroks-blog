---
title: "Auto-switching Node.js Versions with .nvmrc"
description: "Configure your shell to automatically load the correct Node.js version when entering a project directory, covering zsh and bash on macOS and nvm-windows and fnm on Windows."
excerpt: "A .nvmrc file declares the intended Node.js version, but without a shell hook it is just a hint. This guide shows how to make your terminal act on that hint automatically — across zsh, bash, and Windows environments."
path: "/auto-switch-node-version-nvmrc/"
publishDate: 2026-04-05
updated: 2026-04-05
category: Developer Experience
tags:
  - Node.js
  - nvm
  - Shell
  - zsh
  - bash
  - Windows
author: TheRoks
---

Switching between Node.js projects that target different runtimes is a persistent source of friction. The canonical solution is to commit a `.nvmrc` file to the repository — a single-line file containing the required Node.js version — and then let the shell enforce it automatically on every directory change. Without a hook, developers must remember to run `nvm use` manually, and version drift is inevitable.

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) installed on macOS (version 0.39 or later)
- At least one project directory containing a `.nvmrc` file (e.g., `20.11.0` or `lts/iron`)
- For Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows) or [fnm](https://github.com/Schniz/fnm) installed

## Why `.nvmrc` alone is not enough

The `.nvmrc` file is passive. Running `node --version` in a directory that contains `.nvmrc: 20.11.0` will still report whatever version was last activated globally with `nvm use`. The file has no effect until something reads it and calls `nvm use` on your behalf.

That "something" is a shell hook that fires whenever the current working directory changes. On macOS, the mechanism differs between zsh and bash; on Windows it requires a different strategy entirely, because neither nvm-windows nor the `cmd.exe` / PowerShell environments expose an equivalent hook out of the box.

## macOS — zsh

Zsh ships with `add-zsh-hook`, a utility that attaches functions to named hook events. The relevant event is `chpwd`, which fires every time `cd` (or any equivalent) changes the working directory. The following script belongs at the end of `~/.zshrc`:

```zsh
# Auto-switch Node.js version based on .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

The final call to `load-nvmrc` outside the hook ensures the function also runs when a new terminal session opens in a project directory, not just on subsequent `cd` operations.

### What each part does

- `nvm_find_nvmrc` — an internal nvm helper that walks up the directory tree looking for a `.nvmrc` file. This means the hook works even in subdirectories of a project.
- `nvm version "$(cat ...)"` — resolves the alias or version string in `.nvmrc` to the canonical version number nvm knows about (e.g., `lts/iron` → `v20.11.1`). Comparing resolved versions avoids false switches when an alias and a version string refer to the same runtime.
- The `N/A` branch installs the version if it is not yet present locally, eliminating a separate `nvm install` step.
- The `else` branch reverts to the nvm default when leaving a project that had a `.nvmrc`, keeping the global environment predictable.

## macOS — bash

Bash has no direct equivalent of `chpwd`. The standard workaround is to override the `cd` built-in and supplement it with `$PROMPT_COMMAND`, which executes before each prompt — covering cases where the directory changes without an explicit `cd` call (e.g., shell scripts or IDE terminal integrations):

```bash
# Auto-switch Node.js version based on .nvmrc
# Place this at the end of ~/.bash_profile or ~/.bashrc

load_nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

export PROMPT_COMMAND="load_nvmrc${PROMPT_COMMAND:+; $PROMPT_COMMAND}"
```

It is worth noting that `$PROMPT_COMMAND` runs before every prompt, not only after `cd`. The function is intentionally idempotent — if the correct version is already active it exits without invoking `nvm use`, so the overhead is negligible beyond the `nvm_find_nvmrc` directory traversal.

On macOS, `~/.bash_profile` is sourced for login shells whereas `~/.bashrc` is sourced for interactive non-login shells. Placing the snippet in `~/.bash_profile` and sourcing `~/.bashrc` from it (if not already the case) avoids the classic omission where terminal.app sessions do not pick up the hook.

## Windows

### nvm-windows

nvm-windows does not provide a shell hook mechanism. The closest equivalent involves PowerShell's `Set-Location` function, which can be overridden in `$PROFILE` to inject a version check after every directory change:

```powershell
# Place in $PROFILE (run `notepad $PROFILE` to open it)

function global:Set-Location {
    param([string]$Path)
    Microsoft.PowerShell.Management\Set-Location $Path

    $nvmrcPath = $PWD.Path
    while ($nvmrcPath -ne [System.IO.Path]::GetPathRoot($nvmrcPath)) {
        if (Test-Path (Join-Path $nvmrcPath '.nvmrc')) {
            $requiredVersion = (Get-Content (Join-Path $nvmrcPath '.nvmrc')).Trim()
            $current = nvm current 2>$null
            if ($current -ne "v$requiredVersion" -and $current -ne $requiredVersion) {
                Write-Host "Switching to Node.js $requiredVersion (from .nvmrc)"
                nvm use $requiredVersion
            }
            return
        }
        $nvmrcPath = Split-Path $nvmrcPath -Parent
    }
}
```

This approach has notable limitations. It only fires when `Set-Location` (or its alias `cd`) is called explicitly in the PowerShell session; it has no equivalent of `$PROMPT_COMMAND` for paths that change by other means. Additionally, `nvm current` on nvm-windows returns the active version as reported by the PATH, which may not always be consistent immediately after `nvm use`.

### fnm (recommended for Windows)

[fnm](https://github.com/Schniz/fnm) is a cross-platform Node.js version manager written in Rust. It ships with native `.nvmrc` (and `.node-version`) support and provides a `--use-on-cd` flag that activates auto-switching at the shell level without manual hook configuration.

Install fnm via winget, Chocolatey, or the official installer, then bootstrap it in PowerShell:

```powershell
# Install fnm (via winget — run in an elevated PowerShell session)
winget install Schniz.fnm
```

Add the following to `$PROFILE` to initialise fnm with auto-switching enabled:

```powershell
# $PROFILE — fnm initialisation with auto-switching
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

For Command Prompt (`cmd.exe`), add an equivalent line to `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\fnm_env.cmd` — or use the fnm-generated shims approach documented in the [fnm README](https://github.com/Schniz/fnm#shell-setup):

```batch
:: Add to a startup script or use the fnm env --shell cmd approach
FOR /f "tokens=*" %i IN ('fnm env --use-on-cd --shell cmd') DO CALL %i
```

For [Clink](https://chrisant996.github.io/clink/) users who extend `cmd.exe` with readline support, fnm also offers a Clink integration that provides the same `chpwd`-equivalent behaviour as the zsh hook.

It is worth noting that fnm also reads `.node-version` files, which some projects prefer as a more portable alternative to `.nvmrc`. Both formats contain a bare version string (e.g., `20.11.0`) and are interchangeable for fnm's purposes.

## Summary

The zsh hook using `add-zsh-hook chpwd` is the most robust option on macOS. It integrates neatly with the nvm ecosystem, handles missing versions by running `nvm install` automatically, and reverts gracefully to the default when leaving a versioned project.

On Windows, fnm is the pragmatic choice. Its native `.nvmrc` auto-switching via `--use-on-cd` removes the need for a manual PowerShell `Set-Location` override and works consistently across PowerShell, Command Prompt, and Windows Terminal. The nvm-windows workaround is viable for teams that cannot change their toolchain, but it carries more edge cases than fnm's first-class support.

The next step is to commit a `.nvmrc` file to every active repository and add the appropriate shell configuration. Once in place, version mismatches become the exception rather than the default.
