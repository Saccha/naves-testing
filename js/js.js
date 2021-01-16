// INICIO DA FUNCAO START()
function start() {

    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    // PRINCIPAIS VARIAVEIS DO JOGO
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var jogo = {}
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    jogo.pressionou = [];

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //MUSICA EM LOOP
    musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
    musica.play();


    // VERIFICA SE O USUARIO PRESSIONA ALGUMA TECLA
    $(document).keydown(function (e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false;
    });


    // GAME LOOP
    jogo.timer = setInterval(loop, 30); // A CADA 30 MILISEGUNDOS

    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();

    } // FIM DA FUNCAO LOOP()


    // FUNCAO QUE MOVE O FUNDO DO JOGO
    function movefundo() {
        esquerda = parseInt($("fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 2); // VALOR INICIAL "1"

    } // FIM DA FUNCAO movefundo()


    // FUNCAO QUE MOVE O JOGADOR
    function movejogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);

            if (topo <= 0) {
                $("#jogador").css("top", topo + 10);
            }
        }

        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);

            if (topo >= 434) {
                $("#jogador").css("top", topo - 10);
            }
        }

        if (jogo.pressionou[TECLA.D]) {
            // CHAMA FUNCAO DISPARO()

            disparo();

        }
    } // FIM DA FUNCAO movejogador()


    // FUNCAO QUE MOVE O INIMIGO1
    function moveinimigo1() {

        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

    } // FIM DA FUNCAO moveinimigo1()


    // FUNCAO QUE O MOVE INIMIGO2
    function moveinimigo2() {

        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {
            $("#inimigo2").css("left", 775);
        }

    } // Fim da função moveinimigo2()


    // FUNCAO QUE MOVE AMIGO
    function moveamigo() {

        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX >= 906) {
            $("#amigo").css("left", 0);
        }

    } // FIM DA FUNCAO moveamigo()


    // FUNCAO QUE DISPARA TIRO
    function disparo() {

        if (podeAtirar == true) {

            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id ='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        }

        // FUNCAO QUE EXECUTA DISPARO
        function executaDisparo() {

            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }

        } // FECHA executaDisparo()

    } // FECHA FUNCAO disparo()


    // FUNCAO QUE MOSTRA COLISAO/DISPAROS DO JOGADOR COM INIMIGOS
    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        // colisao1 JOGADOR COM INIMIGO1
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }

        console.log(colisao1);

        // colisao2 JOGADOR COM INIMIGO2
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        // colisao3 DISPARO COM INIMIGO1
        if (colisao3.length > 0) {
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }

        // colisao4 DISPARO COM INIMIGO2
        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

        }

        // colisao5 JOGADOR COM AMIGO
        if (colisao5.length > 0) {
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();

        }

        // colisao6 INIMIGO2 COM AMIGO
        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();

        }

    }// FIM DA FUNCAO colisao()


    // FUNCAO DE EXPLOSAO1
    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play();

        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }

    } // FIM DA FUNCAO explosao1()


    //FUNCAO QUE REPOSICIONA O INIMIGO
    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    } // FIM DA FUNCAO reposicionaInimigo2()


    // FUNCAO DE EXPLOSAO2
    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div = $("explosao2");
        div.css("top", inimigo2Y);
        div.css("left", inimigo2X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {
            div.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        } // FIM DA FUNCAO removeExplosao2()

    } // FIM DA FUNCAO explosao2()

    // REPOSICIONA AMIGO
    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

            }

        }

    } // FIM DA FUNCAO reposicionaAmigo()

    // FUNCAO DE EXPLOSAO3
    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    } // FIM DA FUNCAO explosao3()

    //FUNCAO PLACAR DO JOGO
    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    } // FIM DA FUNCAO placar()

    //FUNCAO DE BARRA DE ENERGIA
    function energia() {
        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(imgs/energia3.png)");

        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(imgs/energia2.png)");

        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(imgs/energia1.png)");

        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(imgs/energia0.png)");

            // GAME OVER   
            gameOver();

        }

    }// FIM DA FUNCAO energia()

    // FUNCAO GAME OVER
    function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").append("<h1> Game OVER </h1><p> Sua pontuação foi de: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3> Jogar Novamente </h3></div>");

    } // FIM DA FUNCAO gameOver()

} // FIM DA FUNCAO start()

//FUNCAO DE REINICIAR JOGO
function reiniciaJogo() {
    somGameOver.pause();
    $("#fim").remove();
    start();

} // FIM DA FUNCAO reiniciaJogo()