//Carrega os eventos da tela inicial
function loadBody(){
    document.getElementById("btn_criar").onclick = criarPartida;
}

/**********************************
Verifica se o campo de palavras foi
preenchido. Se sim, então cria a
partida...
**********************************/
function criarPartida(){
    let txtWords = document.getElementById("txt_palavras").value.toUpperCase();

    if(txtWords == "") {
        alert("Digite pelo menos uma palavra para iniciar uma partida.");
        return;
    }

    let words = txtWords.split(" ");

    clearTable();
    criarCacaPalavras(words);

    document.getElementById("tela_jogo").style.display = "block";
    document.getElementById("tela_inicial").style.display = "none";
}

/**********************************
Faz a limpeza das palavras para
garantir que não haverão palavras
com mais de 100 caracteres
**********************************/
function criarCacaPalavras(words){
    words = cleanWords(words);

    if(words.length <= 0){
        alert("Nenhuma palavra válida foi encontrada. Tente inserir palavras menores.");
        return;
    }

    resizeHeader();

    putWordsOnTable(words);
    putRandomLetters();
}

/*************************************
Remove as palavras com mais de 100
caracteres...
*************************************/
function cleanWords(words){
    for(let i = 0; i < words.length; i++){
        let word = words[i];

        if(word.length > 100){
            alert("A palavra " + word + " não pode ser usada pois contém mais de 100 caracteres.");
            words.splice(i, 1);
            i--;
        }
    }

    return words;
}

/************************************
Define uma direção para a palavra...
direction 0 = esquerda para direita
direction 1 = cima para baixo
************************************/
function getDirections(words){
    let directionWords = [];

    words.forEach(function(word, index){
        let direction = getRandomNumber(2, false);
        directionWords[index] = direction;
    });

    return directionWords;
}

/*************************************
Aloca as palavras na tabela
*************************************/
function putWordsOnTable(words){
    let table = document.getElementById("table_jogo");
    let directionWords = getDirections(words);

    words.forEach(function(word, index){
        if(directionWords[index] == 0){
            putHorizontalWord(word);
        } else {
            putVerticalWord(word);
        }
    });
}

/*************************************
Coloca as letras randômicas nas celu-
las vazias e adiciona os eventos nas
celulas...
**************************************/
function putRandomLetters(){
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W',
                    'Y', 'Z'];

    let random;
    let cell;

    for(let i = 0; i < 100; i++){
        cell = getElementCell(i);

        setCellToSelectable(cell);

        if(cell.textContent == ""){
            random = getRandomNumber(26);
            cell.textContent = letters[random];
        }
    }

    return;
}

/*******************************************
Manipula os eventos de mousedown, mouseover
e mouseup, selecionando os campos que o
usuário deseja.
********************************************/
function setCellToSelectable(cell){
    let mouseDown = document.getElementById("mouseDown");
    cell.onmousedown = function(){
        mouseDown.value = "true";
        setCellSelected(cell);
    }

    cell.onmouseup = function(){
        mouseDown.value = "false";
        checaPalavraSelecionada()
    }

    cell.onmouseover = function(){
        if(mouseDown.value == "true") {
            setCellSelected(cell);
        }
    }
}

/****************************************
Seta a célula selecionada, mudando a cor
do campo.
*****************************************/
function setCellSelected(cell){
    let palavraSelecionada = document.getElementById("palavraSelecionada");
    let palavra = palavraSelecionada.value + cell.textContent;
    palavraSelecionada.value = palavra;
    if(cell.style.border != "2px solid green") cell.style.border = "2px solid #5B00BB";
}

/*****************************************
Checa se a palavra selecionada é válida ou
não.. se for válida, então adiciona a
palavra nas palavras encontradas...
******************************************/
function checaPalavraSelecionada(){
    let palavraSelecionada = document.getElementById("palavraSelecionada");
    let palavrasCadastradas = document.getElementById("palavrasCadastradas");

    palavrasCadastradas = palavrasCadastradas.innerHTML.split(" ");

    Array.from(palavrasCadastradas).forEach(function(palavra, index){
        if(palavraSelecionada.value == palavra) palavraValida(palavra);
        else if(index >= palavrasCadastradas.length-1) palavraInvalida();
    });

    palavraSelecionada.value = "";
}

/**********************************************
Muda a cor das células da palavra selecionada
e adiciona a palavra nas "palavras encontradas"
***********************************************/
function palavraValida(word){
    let palavrasEncontradas = document.getElementById("palavras_encontradas");
    let palavrasCadastradas = document.getElementById("palavrasCadastradas");
    let cadastrada = false;
    let cell;

    for(let i = 0; i < 100; i++){
        cell = getElementCell(i);
        if(cell.style.border == "2px solid rgb(91, 0, 187)") cell.style.border = "2px solid green";
    }

    let palavrasEncontradasSplit = palavrasEncontradas.innerHTML.split(" ");
    Array.from(palavrasEncontradasSplit).forEach(function(palavra){
        if(palavra == word){
            cadastrada = true;
        }
    });

    if(!cadastrada){
        palavrasEncontradas.innerHTML += word + " ";
        if(palavrasEncontradas.innerHTML.split(" ").length == palavrasCadastradas.innerHTML.split(" ").length){
            if(confirm("Parabéns! Você encontrou todas as palavras!\nDeseja reiniciar o jogo?")) restartGame();
        }
    }
}

/**************************************
Reseta as celulas selecionadas para o
modo padrão, pois a palavra é invalida
***************************************/
function palavraInvalida(){
    let cell;

    for(let i = 0; i < 100; i++){
        cell = getElementCell(i);
        if(cell.style.border == "2px solid rgb(91, 0, 187)") cell.style.border = "1px solid #5B00BB";
    }
}

/**********************************
Aloca as palavras na horizontal
**********************************/
function putHorizontalWord(word){
    let rowStart = getRandomNumber(10, false);
    let colStart = getRandomNumber(10, false);
    let cell = (rowStart * 10) + colStart;
    let tentativas = 0;

    while(!checaCampoValidoHorizontal(cell, word)){
        rowStart = getRandomNumber(10, false);
        colStart = getRandomNumber(10, false);
        cell = (rowStart * 10) + colStart;

        tentativas++;
        if(tentativas > 20) {
            palavraNaoUsada(word);
            return;
        }
    }

    document.getElementById("palavrasCadastradas").innerHTML += word + " ";

    Array.from(word).forEach(function(letter){
        console.log("Colocando a letra " + letter + " na célula " + cell);
        let elementCell = getElementCell(cell);

        elementCell.textContent = letter;

        cell = getNextHorizontal(cell);

        console.log("Célula atualizada: " + cell);
    });
}

/**********************************
Aloca as palavras na vertical
**********************************/
function putVerticalWord(word){
    let rowStart = getRandomNumber(10, false);
    let colStart = getRandomNumber(10, false);
    let cell = (rowStart * 10) + colStart;
    let tentativas = 0;

    while(!checaCampoValidoVertical(cell, word)){
        rowStart = getRandomNumber(10, false);
        colStart = getRandomNumber(10, false);
        cell = (rowStart * 10) + colStart;

        tentativas++;
        if(tentativas > 20) {
            palavraNaoUsada(word);
            return;
        }
    }

    document.getElementById("palavrasCadastradas").innerHTML += word + " ";

    Array.from(word).forEach(function(letter){
        console.log("Colocando a letra " + letter + " na célula " + cell);
        let elementCell = getElementCell(cell);

        elementCell.textContent = letter;

        cell = getNextVertical(cell);

        console.log("Célula atualizada: " + cell);
    });
}

/******************************************
Verifica se a celula de inicio da palavra
é valida, pois pode ser que uma palavra
sobreponha a outra, e isso não pode acon-
tecer..
******************************************/
function checaCampoValidoHorizontal(start, word){
    let valido = true;

    Array.from(word).forEach(function(letter){
        console.log("Verificando se a célula " + start + " está vazia...");
        let elementCell = getElementCell(start);
        console.log("Campo " + start + " contém " + elementCell.textContent);

        if(elementCell.textContent != "") valido = false;

        start = getNextHorizontal(start);
    });

    return valido;
}

function checaCampoValidoVertical(start, word){
    let valido = true;

    Array.from(word).forEach(function(letter){
        let elementCell = getElementCell(start);

        if(elementCell.textContent != "" && elementCell.textContent != letter) valido = false;

        start = getNextVertical(start);
    });

    return valido;
}

/******************************************
Captura a célula pelo número da célula.
 0| 1| 2| 3| 4| 5| 6| 7| 8| 9
10|11|12|13|14|15|16|17|18|19
20|21|22|23|24|25|26|27|28|29
30|31|32|33|34|35|36|37|38|39
40|41|42|43|44|45|46|47|48|49
50|51|52|53|54|55|56|57|58|59
60|61|62|63|64|65|66|67|68|69
70|71|72|73|74|75|76|77|78|79
80|81|82|83|84|85|86|87|88|89
90|91|92|93|94|95|96|97|98|99
******************************************/
function getElementCell(cell){
    let row = Math.floor(cell / 10);
    let col = cell - (row * 10);

    let table = document.getElementById("table_jogo");
    let rows = table.rows;

    return rows[row].cells[col];
}

/**************************************
Captura a próxima célula que deve ser
usada na horizontal.
**************************************/
function getNextHorizontal(atual){
    atual++;
    if(atual > 99) atual = 0;

    return atual;
}

/***************************************
Captura a próxima célula que dever ser
usada na vertical.
****************************************/
function getNextVertical(atual){
    atual += 10;
    if(atual > 99 && atual < 109) atual = atual - 100 + 1;
    else if(atual >= 109) atual = 0;

    return atual;
}

/*****************************************
Limpa a tabela inteira, deixando os campos
vazios.
******************************************/
function clearTable(){
    for(let i = 0; i < 100; i++){
        let cell = getElementCell(i);
        cell.textContent = "";
        cell.style.border = "1px solid #5B00BB";
    }

    return;
}

/*****************************************
Alerta o usuário quando uma palavra não
pode ser usada pois acabaram os espaços.
******************************************/
function palavraNaoUsada(word){
    alert("A palavra " + word + " não pode ser usada pois não tem espaço no caça palavras.");
    return;
}

/*****************************************
Gera um número randômico de 0 até max-1.
Se addOne for true, então gera um número
de 1 até max.
*****************************************/
function getRandomNumber(max, addOne){
    if(addOne === true) return Math.floor(Math.random() * max) + 1;
    else return Math.floor(Math.random() * max);
}

/**********************************************
Faz o resize do header quando inicia o jogo
***********************************************/
function resizeHeader(){
    let header = document.getElementsByTagName("header")[0];
    let title = header.getElementsByTagName("h1")[0];
    let p = header.getElementsByTagName("p")[0];

    header.classList.add("small_header");
    title.classList.add("small_title");
    p.style.display = "none";
}

function restartGame(){
    document.getElementById("palavrasCadastradas").innerHTML = "";
    document.getElementById("palavras_encontradas").innerHTML = "";
    document.getElementById("mouseDown").value = "false";
    document.getElementById("palavraSelecionada").value = "";
    document.getElementById("txt_palavras").value = "";
    document.getElementById("tela_jogo").style.display = "none";
    document.getElementById("tela_inicial").style.display = "block";
}
