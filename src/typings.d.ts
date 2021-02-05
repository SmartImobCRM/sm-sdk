declare module 'xml-reader';
declare module 'xml-reader-types' {
    export type XmlNode = {
        name: string | ''
        type: 'element' | 'text'
        value: string
        parent: XmlNode
        attributes: {
            [attr_name: string]: any
        }
        children: XmlNode[]
    }
}