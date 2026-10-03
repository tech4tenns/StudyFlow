/* ========================================
   STUDY FLOW - CONTROLE DE ESTUDOS
======================================== */

let timer = null;
let elapsedSeconds = 0;
let startTime = null;
let isRunning = false;

/* Dados salvos */
let sessions = JSON.parse(
    localStorage.getItem("studySessions") || "[]"
);

let goalMinutes = Number(
    localStorage.getItem("weeklyGoal") || 960
);


/* ========================================
   ELEMENTOS
======================================== */

const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startButton");
const finishButton = document.getElementById("finishButton");
const subjectSelect = document.getElementById("subject");

const totalTimeElement = document.getElementById("totalTime");
const totalSessionsElement = document.getElementById("totalSessions");
const completionRateElement = document.getElementById("completionRate");

const sessionCountElement = document.getElementById("sessionCount");
const sessionsList = document.getElementById("sessionsList");

const weeklyGoalElement = document.getElementById("weeklyGoal");
const remainingGoalElement = document.getElementById("remainingGoal");

const statusIndicator = document.getElementById("statusIndicator");


/* ========================================
   CRONÔMETRO
======================================== */

function toggleTimer() {

    if (!isRunning) {
        startTimer();
    } else {
        pauseTimer();
    }

}


/* ========================================
   INICIAR
======================================== */

function startTimer() {

    const subject = subjectSelect.value;

    if (!subject) {

        alert("Selecione uma matéria antes de iniciar.");

        subjectSelect.focus();

        return;
    }


    isRunning = true;

    startTime = Date.now();


    startButton.textContent = "⏸ Pausar estudo";

    finishButton.disabled = false;

    subjectSelect.disabled = true;

    statusIndicator.textContent = "Estudando";

    statusIndicator.classList.add("studying");


    timer = setInterval(updateTimer, 1000);

    updateTimer();

}


/* ========================================
   ATUALIZAR CRONÔMETRO
======================================== */

function updateTimer() {

    if (!isRunning) {
        return;
    }


    const currentTime = Date.now();


    elapsedSeconds =
        Math.floor(
            (currentTime - startTime) / 1000
        );


    showTimer(elapsedSeconds);

}


/* ========================================
   PAUSAR
======================================== */

function pauseTimer() {

    if (!isRunning) {
        return;
    }


    clearInterval(timer);

    timer = null;

    elapsedSeconds =
        Math.floor(
            (Date.now() - startTime) / 1000
        );


    isRunning = false;


    startButton.textContent =
        "▶ Continuar estudo";


    finishButton.disabled = false;

    subjectSelect.disabled = false;


    statusIndicator.textContent =
        "Pausado";

    statusIndicator.classList.remove(
        "studying"
    );


    showTimer(elapsedSeconds);

}


/* ========================================
   MOSTRAR TEMPO
======================================== */

function showTimer(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;


    timerDisplay.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(secs).padStart(2, "0")}`;
}


/* ========================================
   CONCLUIR SESSÃO
======================================== */

function finishSession() {

    /*
       Se estiver estudando, atualiza o tempo
       antes de salvar.
    */

    if (isRunning) {

        elapsedSeconds =
            Math.floor(
                (Date.now() - startTime) / 1000
            );

    }


    if (elapsedSeconds <= 0) {

        alert(
            "Você precisa estudar por pelo menos alguns segundos."
        );

        return;
    }


    const subject =
        subjectSelect.value;


    if (!subject) {

        alert("Selecione uma matéria.");

        return;
    }


    const now =
        new Date();


    /*
       Cria a sessão
    */

    const newSession = {

        id: Date.now(),

        subject: subject,

        duration: elapsedSeconds,

        date: now.toLocaleDateString(
            "pt-BR"
        ),

        time: now.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        timestamp: now.getTime()

    };


    /*
       Coloca a sessão no começo da lista
    */

    sessions.unshift(newSession);


    /*
       SALVA NO NAVEGADOR
    */

    localStorage.setItem(
        "studySessions",
        JSON.stringify(sessions)
    );


    console.log(
        "Sessão salva:",
        newSession
    );


    /*
       Limpa o cronômetro
    */

    clearInterval(timer);

    timer = null;

    elapsedSeconds = 0;

    startTime = null;

    isRunning = false;


    /*
       Volta a interface para o estado inicial
    */

    showTimer(0);


    startButton.textContent =
        "▶ Iniciar estudo";


    finishButton.disabled = true;

    subjectSelect.disabled = false;

    subjectSelect.value = "";


    statusIndicator.textContent =
        "Pronto";

    statusIndicator.classList.remove(
        "studying"
    );


    /*
       ATUALIZA TUDO
    */

    updateDashboard();


    alert(
        "Sessão salva com sucesso!"
    );

}


/* ========================================
   DASHBOARD
======================================== */

function updateDashboard() {

    /*
       Todas as sessões desta semana
    */

    const weeklySessions = sessions;


    /*
       TEMPO TOTAL
    */

    const totalSeconds =
        weeklySessions.reduce(
            (total, session) => {

                return total + session.duration;

            },
            0
        );


    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    totalTimeElement.textContent =
        `${hours}h ${String(minutes).padStart(2, "0")}min`;


    /*
       SESSÕES
    */

    totalSessionsElement.textContent =
        weeklySessions.length;


    sessionCountElement.textContent =
        weeklySessions.length;


    /*
       TAXA DE CONCLUSÃO
    */

    const rate =
        Math.min(
            100,
            Math.round(
                (weeklySessions.length / 7) * 100
            )
        );


    completionRateElement.textContent =
        `${rate}%`;


    /*
       META
    */

    updateGoal(totalSeconds);


    /*
       LISTA
    */

    renderSessions()


    /*
       MATÉRIAS
    */

    updateSubjects(
        weeklySessions
    );

}


/* ========================================
   PEGAR SESSÕES DA SEMANA
======================================== */

function getWeeklySessions() {

    const now = new Date();


    /*
       Segunda-feira
    */

    const day =
        now.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    const monday =
        new Date(now);


    monday.setDate(
        now.getDate() - difference
    );


    monday.setHours(
        0,
        0,
        0,
        0
    );


    return sessions.filter(
        session => {

            const sessionDate =
                new Date(session.timestamp);


            return sessionDate >= monday;

        }
    );

}


/* ========================================
   RENDERIZAR SESSÕES
======================================== */

    function renderSessions() {

    console.log("Renderizando sessões:", sessions);

    if (!sessionsList) {
        console.error("Elemento #sessionsList não encontrado.");
        return;
    }

    if (!sessions || sessions.length === 0) {

        sessionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">◷</div>

                <strong>
                    Nenhuma sessão ainda
                </strong>

                <p>
                    Comece a estudar e suas sessões
                    aparecerão aqui.
                </p>
            </div>
        `;

        return;
    }


    sessionsList.innerHTML = "";


    sessions.slice(0, 10).forEach(function(session) {

        const item = document.createElement("div");

        item.className = "session-item";


        item.innerHTML = `

            <div class="session-left">

                <div class="session-icon">
                    ✓
                </div>

                <div>

                    <strong>
                        ${session.subject || "Estudo"}
                    </strong>

                    <small>
                        ${session.date || ""}
                        •
                        ${session.time || ""}
                    </small>

                </div>

            </div>


            <span class="session-duration">
                ${formatDuration(
                    Number(session.duration || 0)
                )}
            </span>

        `;


        sessionsList.appendChild(item);

    });

}   


/* ========================================
   FORMATAR DURAÇÃO
======================================== */

function formatDuration(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );


    if (hours > 0) {

        return `${hours}h ${minutes}min`;

    }


    return `${minutes}min`;

}


/* ========================================
   META
======================================== */

function openGoalModal() {

    const modal =
        document.getElementById("goalModal");

    const input =
        document.getElementById("goalInput");


    if (!modal || !input) {
        return;
    }


    input.value =
        goalMinutes / 60;


    modal.classList.add("show");

    input.focus();

}


function closeGoalModal() {

    const modal =
        document.getElementById("goalModal");


    if (modal) {
        modal.classList.remove("show");
    }

}


function saveGoal() {

    const input =
        document.getElementById("goalInput");


    const hours =
        Number(input.value);


    if (
        !Number.isFinite(hours) ||
        hours <= 0
    ) {

        alert(
            "Digite uma meta válida."
        );

        return;
    }


    goalMinutes =
        Math.round(hours * 60);


    localStorage.setItem(
        "weeklyGoal",
        goalMinutes
    );


    updateDashboard();

    closeGoalModal();

}


/* ========================================
   ATUALIZAR META
======================================== */

function updateGoal(totalSeconds) {

    const goalSeconds =
        goalMinutes * 60;


    const goalHours =
        goalMinutes / 60;


    weeklyGoalElement.textContent =
        `${goalHours}h`;


    const remaining =
        Math.max(
            0,
            goalSeconds - totalSeconds
        );


    if (remaining === 0) {

        remainingGoalElement.textContent =
            "Meta atingida 🎉";

        return;
    }


    const hours =
        Math.floor(
            remaining / 3600
        );


    const minutes =
        Math.floor(
            (remaining % 3600) / 60
        );


    remainingGoalElement.textContent =
        `${hours}h ${String(minutes).padStart(2, "0")}min restantes`;

}


/* ========================================
   MATÉRIAS
======================================== */

function updateSubjects(weeklySessions) {

    const data = {

        "Matemática": [
            "mathTime",
            "mathProgress"
        ],

        "Português": [
            "portugueseTime",
            "portugueseProgress"
        ],

        "Física": [
            "physicsTime",
            "physicsProgress"
        ],

        "História": [
            "historyTime",
            "historyProgress"
        ],

        "Química": [
            "chemistryTime",
            "chemistryProgress"
        ],

        "Programação": [
            "programmingTime",
            "programmingProgress"
        ]

    };


    const subjectTotals = {};


    weeklySessions.forEach(
        session => {

            if (!subjectTotals[session.subject]) {

                subjectTotals[session.subject] = 0;

            }


            subjectTotals[session.subject] +=
                session.duration;

        }
    );


    Object.keys(data).forEach(
        subject => {

            const seconds =
                subjectTotals[subject] || 0;


            const minutes =
                Math.floor(
                    seconds / 60
                );


            const timeElement =
                document.getElementById(
                    data[subject][0]
                );


            const progressElement =
                document.getElementById(
                    data[subject][1]
                );


            if (timeElement) {

                timeElement.textContent =
                    `${minutes}min`;

            }


            if (progressElement) {

                const percentage =
                    Math.min(
                        100,
                        (seconds /
                            (goalMinutes * 60)
                        ) * 100
                    );


                progressElement.style.width =
                    `${percentage}%`;

            }

        }
    );

}


/* ========================================
   INICIALIZAÇÃO
======================================== */

function initialize() {

    console.log("Study Flow iniciado.");

    console.log(
        "Sessões encontradas:",
        sessions
    );


    showTimer(0);

    finishButton.disabled = true;

    updateDashboard();

}


initialize();

// ========================================
// PLANEJAMENTO DA ROTINA
// ========================================

const chavePlanejamento = "studyPlans";


// ========================================
// CARREGAR PLANEJAMENTO
// ========================================

function carregarPlanejamento() {

    const planningList =
        document.getElementById("planningList");

    const plannedCount =
        document.getElementById("plannedCount");


    // Se a área não existir
    if (!planningList) {
        return;
    }


    // Pega os estudos salvos
    const estudos = JSON.parse(
        localStorage.getItem(chavePlanejamento) || "[]"
    );


    // Mostra quantidade
    if (plannedCount) {

        plannedCount.textContent =
            estudos.length;

    }


    // ========================================
    // NENHUM ESTUDO
    // ========================================

    if (estudos.length === 0) {

        planningList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <strong>
                    Nenhum estudo planejado
                </strong>

                <p>
                    Adicione estudos em
                    "Minha rotina".
                </p>

            </div>

        `;

        return;
    }


    // ========================================
    // MOSTRAR ESTUDOS
    // ========================================

    planningList.innerHTML = "";


    estudos.forEach(function(estudo) {

        let duracao = "";


        // Horas
        if (estudo.horas > 0) {

            duracao +=
                estudo.horas + "h ";

        }


        // Minutos
        if (estudo.minutos > 0) {

            duracao +=
                estudo.minutos + "min";

        }


        // Criar elemento
        const item =
            document.createElement("div");


        item.className =
            "session-item";


        item.innerHTML = `

            <div class="session-left">

                <div class="session-icon">
                    📚
                </div>


                <div>

                    <strong>
                        ${estudo.materia}
                    </strong>

                    <small>
                        ${estudo.conteudo}
                    </small>

                    <small>
                        ${estudo.data}
                        •
                        ${estudo.hora}
                    </small>

                </div>

            </div>


            <span class="session-duration">
                ${duracao}
            </span>

        `;


        planningList.appendChild(item);

    });

}


// ========================================
// CARREGAR QUANDO ABRIR
// ========================================

carregarPlanejamento();


// ========================================
// ATUALIZAR SE O LOCAL STORAGE MUDAR
// ========================================

window.addEventListener(
    "storage",
    carregarPlanejamento
);