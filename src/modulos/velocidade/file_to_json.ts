import { promises as fs } from 'fs';
import * as path from 'path';
import * as xml_reader from 'xml-reader';
import { XmlNode } from 'xml-reader-types'

type JSON_Dataframe = {
    JSON: string
    JSON_parsed?: any
    fields?: string[]
    from_ext?: string
    fields_example?: {
        [field: string]: (string | null | number)
    }
    fields_values?: {
        [field: string]: (string | null | number)[]
    }
    rows?: string[][]
    random_row?: string[]
}

export const file_to_json = async (f_path:string, options?: {
    encoding?: null | undefined;
    just_res?: boolean;
    /**
     * Parser criado manualmente, deve retornar uma estrutura de JSON 
     */
    parse_with?: (file_as_string:string) => Promise<string>
    flag?: string | number | undefined;
}):Promise<JSON_Dataframe> => {
    const file_res = await fs.readFile(f_path, options)
    const file_as_string = file_res.toString()

    if (options?.just_res) return {
        JSON: file_as_string
    };
    if (options?.parse_with) {
        const json_custom_parser = await options.parse_with(file_as_string)
        const json_custom_parser__parsed = JSON.parse(json_custom_parser);
        return {
            JSON: json_custom_parser,
            JSON_parsed: json_custom_parser__parsed,
        }
    }

    const ext = path.extname(f_path)
    const f_name = path.basename(f_path, ext)
    switch (ext) {
        case '.xml':
            const reader = xml_reader.create({ parentNodes: false })
            
            const reader_data:XmlNode = await new Promise((resolve, reject) => {
                reader.on('done', resolve)
                reader.parse(file_as_string)
            });

            /**
             * Caso só tenha um children provavelmente os dados estão em uma camada mais abaixo, 
             * a não ser que o arquivo tenha apenas uma informação relevante.
             * 
             * Vamos fazer uma função recursiva até achar mais de 1 children, no maximo 10 iterações.
             */
            let i_multi_children = 0;
            const recursive_find_children = (parent:XmlNode):XmlNode[] => {
                i_multi_children++
                if (i_multi_children <= 10 && parent.children.length === 1) return recursive_find_children(parent.children[0]);
                if (i_multi_children <= 10) {
                    console.log(`O método "recursive_find_children" no arquivo "${f_name}" teve 10 ou mais iterações para achar uma array de itens válidos. Provavelmente algo está errado com esse arquivo.`)
                }
                return parent.children;
            }

            const items = recursive_find_children(reader_data)

            return {
                JSON: JSON.stringify(items),
                JSON_parsed: items
            }
        default:
            console.log('Nenhum método de processamento foi encontrado para arquivos de tipo '+ext+' . Utilize a opção "just_res" para retornar o arquivo selecionado como string e fazer o processamento para JSON ou outro formato manualmente. Ou use a opção "parse_with" para criar um processador de arquivos customizado.')
            break;
    }

    return {
        JSON: file_as_string
    };
}

const JSON_to_dataframe = (json:string|object):JSON_Dataframe => {
    const json_string = typeof json === 'string' ? json : JSON.stringify(json);
    const json_parsed = JSON.parse(json_string);

    const fields:string[] = []
    const fields_example:{
        [field:string]:number|string|null
    } = {};

    for (const key in json_parsed) {
        if (Object.prototype.hasOwnProperty.call(json_parsed, key)) {
            const element = json_parsed[key];
            
        }
    }

    return {
        JSON: json_string,
        JSON_parsed: json_parsed,
        fields,
        fields_example
    }
}