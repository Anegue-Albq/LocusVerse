async function cadastrar(nome, email, senha) {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        if (!response.ok) {
            // Trata erros de validação/regra de negócio (ex: email já cadastrado)
            throw new Error(`Erro no cadastro (Status ${response.status})`);
        }


    } catch (error) {
        console.error('Falha no processo de cadastro:', error);

        // Exibe mensagem de erro na div do formulário
        const errorElement = document.getElementById('cadastro-email-error');
        if (errorElement) {
            errorElement.textContent = 'Não foi possível concluir o cadastro. Verifique os dados.';
        }
    }
}

// Vincula o evento de Submit do formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[data-validate]');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o reload da página

            const nome = document.getElementById('cadastro-nome').value;
            const email = document.getElementById('cadastro-email').value;
            const senha = document.getElementById('cadastro-senha').value;

            await cadastrar(nome, email, senha);
        });
    }
});