function populateButtons(jsonFile, containerId) {
    $.getJSON(jsonFile, (buttonsSettings) => {
        const buttons = buttonsSettings.map(buttonSetting => {
            return `
                <button class="${buttonSetting.class}" onclick="showTemplate('${buttonSetting.stage}', '${buttonSetting.project}')">
                    ${buttonSetting.stage}
                </button>
            `;
        });

        const buttonContainer = document.getElementById(containerId);
        buttonContainer.innerHTML = buttons.join('');
    });
}


populateButtons("./data/analyst.json", 'button-container-analyst');
populateButtons("./data/develop.json", 'button-container-develop');
populateButtons("./data/test-automation.json", 'button-container-test-automation')
populateButtons("./data/backend.json", 'button-container-backend')
populateButtons("./data/frontend.json", 'button-container-frontend')
populateButtons("./data/estoria.json", 'button-container-estoria')
populateButtons("./data/qa.json", 'button-container-qa');
populateButtons("./data/flow.json", 'button-container-flow');

function copyToClipboard(element) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    const children = document.getElementById(element).children;
    const lines = [];
    for (let i = 0; i < children.length; i++) {
        lines.push(children.item(i).innerHTML);
    }

    $temp.val(lines.join('')).select();
    document.execCommand("copy");
    $temp.remove();
    const copiedPhrase = document.getElementById('template-copy-phrase');
    copiedPhrase.className = 'd-flex justify-content-center text-success bold'
}

function showTemplate(status, project) {

    const jsonFileMap = {
        'Analyst': './data/analyst.json',
        'Develop': './data/develop.json',
        'Test-Automation': './data/test-automation.json',
        'Backend': './data/backend.json',
        'Frontend': './data/frontend.json',
        'Estoria': './data/estoria.json',
        'QA': './data/qa.json',
        'Flow': './data/flow.json'
    };

    const jsonFile = Object.keys(jsonFileMap).find(key => {
        console.log(`Verificando chave: ${key} - Projeto: ${project}`);
        return project.toLowerCase().includes(key.toLowerCase());
    }) || 'data';
    
    console.log(`jsonFile selecionado: ${jsonFile}`);
    

    $.getJSON(`./data/${jsonFile}.json`, (buttonsSettings) => {
        const copiedPhrase = document.getElementById('template-copy-phrase');
        copiedPhrase.className = 'd-none'
        const buttonSetting = buttonsSettings.filter(settings => settings.stage === status)[0];
        const result = document.getElementById('result');
        const template = document.getElementById('template');
        result.className = 'show border mt-3';
        template.innerHTML = buildTemplate(buttonSetting);
    });
}

function buildTemplate(stage) {
    const informations = stage.informations;
    return `
            <div>
                <p class="mb-0 mt-2">
                    <span class="bold">
                    Status onde ação deve ocorre:
                    </span>
                     ${informations.source.join(',')}
                </p>
                <p class="m-0">
                    <span class="bold">
                        Autor:
                    </span> ${informations.author}
                </p>
                   <p class="m-0">
                    <span class="bold">
                        Flegar task?:
                    </span>
                     ${informations.flagged ? informations.flagged:false}
                </p>
                <p class="m-0">
                    <span class="bold">
                        Mudar Responsável?:
                    </span>
                     ${informations.changeAssigned ? 'Sim' : 'Não'}
                </p>
                <p class="m-0">
                    <span class="bold">
                        Responsável:
                    </span>
                     ${informations.assigned ? informations.assigned : 'Não alterar'}
                </p>
                <p class="m-0">
                    <span class="bold">
                        Enviar para:
                    </span>
                     ${!!informations.sendToStage ? informations.sendToStage : 'Não alterar estágio'}
                </p>
                <p class="m-0">
                    <span class="bold">
                        Pessoas que devo marcar:
                    </span>
                     ${!!informations.tagUser ? informations.tagUser?.join(',') : 'Não precisa marcar ninguém'}
                </p>
                <hr>
                <div>
                    <h5 class="bold">
                        Template
                    </h5>
                    <div id="${stage.stage}">
                        ${informations.template}
                    </div>
                    <button id="liveToastBtn" onclick="copyToClipboard('${stage.stage}')" class="btn btn-primary">
                        Copiar
                    </button>
                    <hr>
                    <h5 class="bold">
                        Instruções
                    </h5>
                    <p class="p-3">
                        ${informations.instructions}
                    </p>
                </div>
            </div>
        `
}
