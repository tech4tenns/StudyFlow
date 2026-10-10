const formLogin = document.getElementById("loginForm");

if (formLogin) {
    const mensagemLogin = document.getElementById("mensagem");

    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const emailLogin = document.getElementById("email").value;
        const senhaLogin = document.getElementById("senha").value;

        if (emailLogin === "" || senhaLogin === "") {
            mensagemLogin.textContent = "Preencha todos os campos.";
            mensagemLogin.style.color = "#d64545";
            return;
        }

        mensagemLogin.textContent = "Login realizado com sucesso!";
        mensagemLogin.style.color = "#2f8f5b";
        window.location.href = "home.html";
    });
}


/* ========== CADASTRO ========== */

const formCadastro = document.getElementById("cadastroForm");

if (formCadastro) {
    const mensagemCadastro = document.getElementById("mensagem");

    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        const nomeCadastro = document.getElementById("nome").value.trim();
        const emailCadastro = document.getElementById("email").value.trim();
        const senhaCadastro = document.getElementById("senha").value;
        const confirmarCadastro = document.getElementById("confirmar").value;

        if (
            nomeCadastro === "" ||
            emailCadastro === "" ||
            senhaCadastro === "" ||
            confirmarCadastro === ""
        ) {
            mensagemCadastro.textContent = "Preencha todos os campos.";
            mensagemCadastro.style.color = "#d64545";
            return;
        }

        if (senhaCadastro.length < 8) {
            mensagemCadastro.textContent =
                "A senha deve ter pelo menos 8 caracteres.";

            mensagemCadastro.style.color = "#d64545";
            return;
        }

        if (senhaCadastro !== confirmarCadastro) {
            mensagemCadastro.textContent =
                "As senhas não coincidem!";

            mensagemCadastro.style.color = "#d64545";
            return;
        }

        mensagemCadastro.textContent =
            "Cadastro realizado com sucesso!";

        mensagemCadastro.style.color = "#2f8f5b";
    });
}


/* ========== RECUPERAR SENHA ========== */

const formRecuperar = document.getElementById("recuperarForm");

if (formRecuperar) {
    const mensagemRecuperar = document.getElementById("mensagem");

    formRecuperar.addEventListener("submit", function(event) {
        event.preventDefault();

        const emailRecuperar =
            document.getElementById("email").value.trim();

        if (emailRecuperar === "") {
            mensagemRecuperar.textContent =
                "Digite seu e-mail.";

            mensagemRecuperar.style.color = "#d64545";
            return;
        }

        mensagemRecuperar.textContent =
            "E-mail validado! O link de recuperação ainda precisa ser configurado.";

        mensagemRecuperar.style.color = "#2f8f5b";
    });
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    if (senha.length < 8) {
        mensagem.textContent = "A senha deve ter pelo menos 8 caracteres.";
        mensagem.style.color = "red";
        return;
    }

    if (senha !== confirmar) {
        mensagem.textContent = "As senhas não coincidem!";
        mensagem.style.color = "red";
        return;
    }

    mensagem.textContent = "Dados validados! Cadastro de demonstração.";
    mensagem.style.color = "green";

    // Futuramente, envie os dados para seu servidor
    // para criar a conta com segurança.
});


document.addEventListener("DOMContentLoaded", function () {

    const formularioRecuperar = document.getElementById("recuperarForm");
    const mensagemRecuperar = document.getElementById("mensagem");

    formularioRecuperar.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailRecuperar = document.getElementById("email");

        if (!emailRecuperar.checkValidity()) {
            emailRecuperar.reportValidity();
            return;
        }

        mensagemRecuperar.style.color = "#2563eb";
        mensagemRecuperar.textContent =
            "E-mail validado! O envio do link de recuperação ainda precisa ser configurado.";
    });

});