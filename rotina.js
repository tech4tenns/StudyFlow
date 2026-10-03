// ========================================
// MINHA ROTINA
// ========================================

const chaveRotina = "studyPlans";

let estudos = JSON.parse(
    localStorage.getItem(chaveRotina) || "[]"
);


// ========================================
// ELEMENTOS DO HTML
// ========================================

const materia = document.getElementById("materia");
const conteudo = document.getElementById("conteudo");
const dataEstudo = document.getElementById("dataEstudo");
const horaEstudo = document.getElementById("horaEstudo");
const duracaoHoras = document.getElementById("duracaoHoras");
const duracaoMinutos = document.getElementById("duracaoMinutos");

const botaoAdicionar =
    document.getElementById("adicionarRotina");

const listaEstudos =
    document.getElementById("listaEstudos");


// ========================================
// SALVAR NO LOCAL STORAGE
// ========================================

function salvarEstudos() {

    localStorage.setItem(
        chaveRotina,
        JSON.stringify(estudos)
    );

}


// ========================================
// ADICIONAR ESTUDO
// ========================================

function adicionarEstudo() {

    const materiaValor = materia.value;
    const conteudoValor = conteudo.value.trim();
    const dataValor = dataEstudo.value.trim();
    const horaValor = horaEstudo.value.trim();

    const horasValor =
        Number(duracaoHoras.value) || 0;

    const minutosValor =
        Number(duracaoMinutos.value) || 0;


    // Verificar matéria
    if (materiaValor === "") {

        alert("Escolha uma matéria.");

        materia.focus();

        return;
    }


    // Verificar conteúdo
    if (conteudoValor === "") {

        alert("Digite o que você vai estudar.");

        conteudo.focus();

        return;
    }


    // Verificar data
    if (dataValor === "") {

        alert("Digite a data do estudo.");

        dataEstudo.focus();

        return;
    }


    // Verificar horário
    if (horaValor === "") {

        alert("Digite o horário do estudo.");

        horaEstudo.focus();

        return;
    }


    // Verificar duração
    if (
        horasValor === 0 &&
        minutosValor === 0
    ) {

        alert("Escolha uma duração.");

        return;
    }


    // ========================================
    // CRIAR ESTUDO
    // ========================================

    const novoEstudo = {

        id: Date.now(),

        materia: materiaValor,

        conteudo: conteudoValor,

        data: dataValor,

        hora: horaValor,

        horas: horasValor,

        minutos: minutosValor,

        concluido: false

    };


    // Coloca o estudo na lista
    estudos.push(novoEstudo);


    // Salva
    salvarEstudos();


    // Atualiza "Seus estudos"
    mostrarEstudos();


    // Limpa formulário
    materia.value = "";

    conteudo.value = "";

    dataEstudo.value = "";

    horaEstudo.value = "";

    duracaoHoras.value = 0;

    duracaoMinutos.value = 30;


    alert("Estudo adicionado à sua rotina!");

}


// ========================================
// MOSTRAR ESTUDOS
// ========================================

function mostrarEstudos() {

    if (!listaEstudos) return;


    // Se não houver estudos
    if (estudos.length === 0) {

        listaEstudos.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <strong>
                    Nenhum estudo planejado
                </strong>

                <p>
                    Adicione um estudo acima
                    e ele aparecerá aqui.
                </p>

            </div>

        `;

        return;
    }


    listaEstudos.innerHTML = "";


    estudos.forEach(function(estudo) {

        let duracao = "";

        if (estudo.horas > 0) {

            duracao +=
                estudo.horas + "h ";

        }

        if (estudo.minutos > 0) {

            duracao +=
                estudo.minutos + "min";

        }


        const item =
            document.createElement("div");

        item.className =
            "scheduled-item";


        item.innerHTML = `

            <div class="scheduled-date">

                <strong>
                    ${estudo.data.split("/")[0] || "--"}
                </strong>

                <small>
                    ${pegarMes(estudo.data)}
                </small>

            </div>


            <div class="scheduled-info">

                <strong>
                    ${estudo.materia}
                </strong>

                <small>
                    ${estudo.conteudo}
                </small>

                <small>
                    ${duracao}
                </small>

            </div>


            <div class="scheduled-time">

                ${estudo.hora}

            </div>

        `;


        listaEstudos.appendChild(item);

    });

}


// ========================================
// PEGAR NOME DO MÊS
// ========================================

function pegarMes(data) {

    const partes =
        data.split("/");

    if (partes.length < 2) {

        return "---";

    }


    const numero =
        Number(partes[1]);


    const meses = [

        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ"

    ];


    return meses[numero - 1] || "---";

}


// ========================================
// BOTÃO
// ========================================

if (botaoAdicionar) {

    botaoAdicionar.addEventListener(
        "click",
        adicionarEstudo
    );

}


// ========================================
// CARREGAR AO ABRIR A PÁGINA
// ========================================

mostrarEstudos();