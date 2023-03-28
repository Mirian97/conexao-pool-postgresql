const pool = require("./conexao")

async function cadastrarAutor(req, res) {
    const { nome, idade } = req.body;

    if (!nome.trim()) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }

    try {
        const query = `
        insert into autores (nome, idade) 
        values ($1, $2) returning *
        `
        const resultado = await pool.query(query, [nome, idade]);
        return res.status(201).json(resultado.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

async function obterAutor(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "O ID deve ser um número válido." });
    }

    try {
        const query = `
        select a.id as autor_id, a.nome as autor_nome, a.idade,
        l.id, l.nome as livro_nome, l.genero, l.editora, l.data_publicacao
        from autores a left join livros l
        on a.autor_id = l.id
        where a.autor_id = $1
        `
        const { rowCount, rows } = await pool.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "O autor não existe." });
        }
        const { autor_id, autor_nome, idade } = rows[0];

        const livros = rows.map(livro => {
            const { id, livro_nome, genero, editora, data_publicacao } = livro;
            return {
                id,
                nome: livro_nome,
                genero,
                editora,
                data_publicacao,
            }
        })
        const autor = {
            id: autor_id,
            nome: autor_nome,
            idade,
            livros,
        }
        return res.status(200).json(autor);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

async function cadastrarLivroParaAutor(req, res) {
    const { id } = req.params;
    const { nome, genero, editora, data_publicacao } = req.body;

    if (!nome.trim()) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }

    try {
        const { rowCount } = await pool.query(
            "select * from autores where id=$1",
            [id]
        )
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "O autor não existe." });
        }

        const query = `
        insert into livros (nome, genero, editora, data_publicacao, autor_id) 
        values ($1, $2, $3, $4, $5) returning *
        `
        const values = [nome, genero, editora, data_publicacao, id]
        const livroCadastrado = await pool.query(query, values);

        return res.status(201).json(livroCadastrado.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

async function listarLivros(req, res) {
    try {
        const query = `
        select l.id, l.nome as livro_nome, l.genero, l.editora, l.data_publicacao, 
        l.autor_id, a.nome as autor_nome, a.idade
        from livros l left join autores a
        on l.autor_id = a.id
        `
        const { rows } = await pool.query(query);

        const livros = rows.map(livro => {
            const { autor_id, autor_nome, idade, ...dadosLivro } = livro
            return {
                ...dadosLivro,
                autor: {
                    id: autor_id,
                    nome: autor_nome,
                    idade
                }
            }
        })
        return res.status(200).json(livros);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

module.exports = {
    cadastrarAutor,
    obterAutor,
    cadastrarLivroParaAutor,
    listarLivros
}