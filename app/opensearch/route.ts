import { NextResponse } from 'next/server'

export async function GET() {
	const opensearchXml = `
		<?xml version="1.0" encoding="UTF-8"?>
		<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
		    <ShortName>Glavsiz.ru</ShortName>
		    <Description>Поиск на сайте Glavsiz.ru</Description>
		    <Tags>search ecommerce</Tags>
		    <Contact>support@glavsiz.ru</Contact>
		    <Url type="text/html" method="get" template="https://glavsiz.ru/catalog?query={searchTerms}"/>
		    <Image height="16" width="16" type="image/x-icon">https://glavsiz.ru/favicon.ico</Image>
		    <InputEncoding>UTF-8</InputEncoding>
		</OpenSearchDescription>
	`
	return new NextResponse(opensearchXml, {
		headers: {
			'Content-Type': 'application/opensearchdescription+xml',
		},
	})
}
