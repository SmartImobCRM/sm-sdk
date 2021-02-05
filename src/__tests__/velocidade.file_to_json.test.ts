import { file_to_json } from '../modulos/velocidade/file_to_json';

test('[velocidade] File to JSON', async () => {
    const res = await file_to_json('./src/__tests__/arquivos/mary.xml')
    console.log(res.JSON_parsed)
    expect(res).toBeDefined()
});
