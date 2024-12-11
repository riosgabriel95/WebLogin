document.getElementById('signupButton').addEventListener('click', function () {
    // Esconde o formulário de login e mostra o de cadastro
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
});

document.getElementById('backButton').addEventListener('click', function () {
    // Esconde o formulário de cadastro e volta ao de login
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

// URL base do servidor
const SERVER_URL = 'http://localhost:3000';

// Login
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            errorMessage.textContent = ''; // Limpa a mensagem de erro
        } else {
            errorMessage.textContent = result.error;
        }
    } catch (error) {
        console.error('Erro:', error);
        errorMessage.textContent = 'Erro de conexão com o servidor.';
    }
});

// Cadastro
document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;

    try {
        const response = await fetch(`${SERVER_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById('backButton').click(); // Volta para o login
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor.');
    }
});
