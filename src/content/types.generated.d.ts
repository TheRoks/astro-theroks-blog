declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]] & Render;

	type BaseCollectionConfig<S extends import('astro/zod').ZodRawShape> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<import('astro/zod').ZodObject<S>>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends import('astro/zod').ZodRawShape>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E] & Render>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<(typeof entryMap[C][E] & Render)[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			injectedFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"blog": {
"2011/create-and-host-your-own-nuget-packages.md": {
  id: "2011/create-and-host-your-own-nuget-packages.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/create-shortcut-to-generate-guid-in-visual-studio.md": {
  id: "2011/create-shortcut-to-generate-guid-in-visual-studio.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/custom-error-message-application-pages-in-sharepoint-2010.md": {
  id: "2011/custom-error-message-application-pages-in-sharepoint-2010.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/exclude-code-from-test-coverage-and-code-analysis.md": {
  id: "2011/exclude-code-from-test-coverage-and-code-analysis.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/how-to-download-memorystream-as-a-file-in-zip.md": {
  id: "2011/how-to-download-memorystream-as-a-file-in-zip.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/how-to-unit-test-code-with-a-fluent-interface-with-typemock-isolator.md": {
  id: "2011/how-to-unit-test-code-with-a-fluent-interface-with-typemock-isolator.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/invalid-postback-or-callback-argument-event-validation-is-enabled.md": {
  id: "2011/invalid-postback-or-callback-argument-event-validation-is-enabled.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/layer-diagram-visual-studio-2010.md": {
  id: "2011/layer-diagram-visual-studio-2010.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/list-all-installed-features-that-are-not-active-with-powershell.md": {
  id: "2011/list-all-installed-features-that-are-not-active-with-powershell.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/ranking-profile-fast-for-sharepoint.md": {
  id: "2011/ranking-profile-fast-for-sharepoint.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/secure-wcf-communication-with-certificates.md": {
  id: "2011/secure-wcf-communication-with-certificates.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/show-raw-xml-sharepoint-search-core-results-web-part.md": {
  id: "2011/show-raw-xml-sharepoint-search-core-results-web-part.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/solving-sql-server-detected-a-logical-consistency-based-io-error.md": {
  id: "2011/solving-sql-server-detected-a-logical-consistency-based-io-error.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/wcf-dispose-problem-with-using-statement.md": {
  id: "2011/wcf-dispose-problem-with-using-statement.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2011/xml-data-sharepoint-from-list-with-owssrv-dll.md": {
  id: "2011/xml-data-sharepoint-from-list-with-owssrv-dll.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/add-custom-styles-to-summarylinkwebpart.md": {
  id: "2012/add-custom-styles-to-summarylinkwebpart.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/dynamically-add-an-icon-on-new-window-links.md": {
  id: "2012/dynamically-add-an-icon-on-new-window-links.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/failed-extract-cab-file-solution.md": {
  id: "2012/failed-extract-cab-file-solution.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/how-to-provision-managed-metadata-columns.md": {
  id: "2012/how-to-provision-managed-metadata-columns.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/managed-metadata-navigation.md": {
  id: "2012/managed-metadata-navigation.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/remove-table-from-web-part-zone-with-control-adapter.md": {
  id: "2012/remove-table-from-web-part-zone-with-control-adapter.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/signalr-to-synchronize-web-pages-real-time.md": {
  id: "2012/signalr-to-synchronize-web-pages-real-time.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/use-powershell-to-find-content-types-and-sitecolumns.md": {
  id: "2012/use-powershell-to-find-content-types-and-sitecolumns.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/using-the-xmlserializer-in-multithreaded-applications.md": {
  id: "2012/using-the-xmlserializer-in-multithreaded-applications.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/when-to-call-ensurechildcontrols.md": {
  id: "2012/when-to-call-ensurechildcontrols.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/xslt-remove-html-comments-attributes-nodes.md": {
  id: "2012/xslt-remove-html-comments-attributes-nodes.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/angularjs-communication-controllers.md": {
  id: "2013/angularjs-communication-controllers.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/angularjs-filter-number-fixed-length.md": {
  id: "2013/angularjs-filter-number-fixed-length.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/best-practices-version-web-api.md": {
  id: "2013/best-practices-version-web-api.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/create-managed-metadata-service-application-with-powershell.md": {
  id: "2013/create-managed-metadata-service-application-with-powershell.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/document-conversion-with-word-automation-services.md": {
  id: "2013/document-conversion-with-word-automation-services.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/enable-browser-file-handling-for-flash-with-powershell.md": {
  id: "2013/enable-browser-file-handling-for-flash-with-powershell.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/how-to-add-icon-to-represent-pdf-documents.md": {
  id: "2013/how-to-add-icon-to-represent-pdf-documents.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/nuget-package-versioning.md": {
  id: "2013/nuget-package-versioning.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/prevent-xsl-namespaces-rendered-in-html-result.md": {
  id: "2013/prevent-xsl-namespaces-rendered-in-html-result.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/related-items-with-a-content-query-webpart.md": {
  id: "2013/related-items-with-a-content-query-webpart.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/show-all-draft-documents-with-content-query-webpart.md": {
  id: "2013/show-all-draft-documents-with-content-query-webpart.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/social-login-owin-authentication-mvc5.md": {
  id: "2013/social-login-owin-authentication-mvc5.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/solving-ca0055-load-dll-code-metrics.md": {
  id: "2013/solving-ca0055-load-dll-code-metrics.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/synchronous-document-conversion-with-word-automation.md": {
  id: "2013/synchronous-document-conversion-with-word-automation.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/unit-test-sharepoint-list-with-typemock-isolator.md": {
  id: "2013/unit-test-sharepoint-list-with-typemock-isolator.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/01/angularjs-minify-code-without-breaking.md": {
  id: "2014/01/angularjs-minify-code-without-breaking.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/03/angularjs-available-testing-frameworks-tooling.md": {
  id: "2014/03/angularjs-available-testing-frameworks-tooling.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/04/running-e2e-tests-angularjs-based-applications-protractor.md": {
  id: "2014/04/running-e2e-tests-angularjs-based-applications-protractor.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/12/angularjs-factory-vs-service-vs-provider.md": {
  id: "2014/12/angularjs-factory-vs-service-vs-provider.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2015/07/solving-attempted-to-use-an-object-that-has-ceased-to-exist.md": {
  id: "2015/07/solving-attempted-to-use-an-object-that-has-ceased-to-exist.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2017/08/use-sitecore-analytics-show-number-pageviews.md": {
  id: "2017/08/use-sitecore-analytics-show-number-pageviews.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/07/using-wpp-targets-file-together-sitecore.md": {
  id: "2018/07/using-wpp-targets-file-together-sitecore.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/12/list-all-the-rich-text-fields-with-inline-styling-in-sitecore-with-powershell-extensions.md": {
  id: "2018/12/list-all-the-rich-text-fields-with-inline-styling-in-sitecore-with-powershell-extensions.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2019/10/efficient-building-a-monorepo-on-azure-devops.md": {
  id: "2019/10/efficient-building-a-monorepo-on-azure-devops.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/07/using-nuget-to-control-fxcop-rulesets.md": {
  id: "2020/07/using-nuget-to-control-fxcop-rulesets.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/12/advanced-git-commands.md": {
  id: "2020/12/advanced-git-commands.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2021/01/introducing-roslyn-analyzers-for-sitecore.md": {
  id: "2021/01/introducing-roslyn-analyzers-for-sitecore.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2021/08/migrate-sitecore-c-sharp-projects-to-nugets-package-references-and-prevent-sitecore-dlls-being-deployed.md": {
  id: "2021/08/migrate-sitecore-c-sharp-projects-to-nugets-package-references-and-prevent-sitecore-dlls-being-deployed.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/sitecore-detect-override-on-items-as-resources-and-revert-it.md": {
  id: "2022/sitecore-detect-override-on-items-as-resources-and-revert-it.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/structure-sitecores-richtext-field-and-get-more-control-over-layout-service-output-and-html.md": {
  id: "2022/structure-sitecores-richtext-field-and-get-more-control-over-layout-service-output-and-html.md",
  slug: string,
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
},

	};

	type ContentConfig = typeof import("./config");
}
