
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. CARROSSEL DE PROJETOS
    // =====================================

    const listaProjetos = document.querySelector("#listaProjetos");

    document.querySelector("#anterior")?.addEventListener("click", () => {
        listaProjetos?.scrollBy({
            left: -260,
            behavior: "smooth"
        });
    });

    document.querySelector("#proximo")?.addEventListener("click", () => {
        listaProjetos?.scrollBy({
            left: 260,
            behavior: "smooth"
        });
    });


    // =====================================
    // 2. EXPANDIR E RECOLHER SEÇÕES
    // =====================================

    document.querySelectorAll(".titulo-secao").forEach(titulo => {

        titulo.addEventListener("click", () => {
            titulo.parentElement.classList.toggle("fechada");
        });

    });


    // =====================================
    // 3. NAVBAR E MENU MOBILE
    // =====================================

    const botaoMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-links");

    function fecharMenu() {
        menu?.classList.remove("aberto");

        botaoMenu?.setAttribute("aria-expanded", "false");
        botaoMenu?.setAttribute("aria-label", "Abrir menu");
    }

    botaoMenu?.addEventListener("click", () => {

        const aberto = menu?.classList.toggle("aberto") ?? false;

        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

    });

    document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {

        link.addEventListener("click", evento => {

            const id = link.getAttribute("href");
            const destino = document.querySelector(id);

            if (!destino) return;

            evento.preventDefault();

            destino.classList.remove("fechada");

            fecharMenu();

            const alturaNavbar =
                document.querySelector(".cabecalho")?.offsetHeight ?? 0;

            const posicao =
                destino.getBoundingClientRect().top +
                window.scrollY -
                alturaNavbar;

            window.scrollTo({
                top: Math.max(0, posicao),
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });

        });

    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") fecharMenu();
    });


    // =====================================
    // 4. ANIMAÇÃO DURANTE O SCROLL
    // =====================================

    const secoes = document.querySelectorAll(
        ".perfil, .projetos, .habilidades, .contatos"
    );

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver(entradas => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                }

            });

        }, {
            threshold: 0.1
        });

        secoes.forEach(secao => {
            secao.classList.add("animar-scroll");
            observador.observe(secao);
        });

    }


    // =====================================
    // 5. HABILIDADES INTERATIVAS
    // =====================================

    document.querySelectorAll(
        '.habilidade input[type="range"]'
    ).forEach(controle => {

        const saida = controle.parentElement.querySelector("output");

        const chave = `habilidade_${controle.id}`;

        // Recuperar valor salvo
        try {
            const salvo = localStorage.getItem(chave);

            if (
                salvo !== null &&
                Number.isFinite(Number(salvo))
            ) {
                controle.value = Math.min(
                    100,
                    Math.max(0, Number(salvo))
                );
            }
        } catch (erro) {
            console.warn("Armazenamento indisponível:", erro);
        }

        // Atualizar porcentagem e preenchimento
        function atualizar() {

            const valor = controle.value;

            if (saida) {
                saida.textContent = `${valor}%`;
            }

            controle.style.setProperty(
                "--valor",
                `${valor}%`
            );

            // Salvar no navegador
            try {
                localStorage.setItem(chave, valor);
            } catch (erro) {
                console.warn(
                    "Não foi possível salvar a habilidade:",
                    erro
                );
            }
        }

        controle.addEventListener("input", atualizar);

        atualizar();

    });


    // =====================================
    // 6. FORMULÁRIO DE CONTATO
    // =====================================

    document.querySelector("#formContato")?.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();

            const formulario = evento.currentTarget;

            if (!formulario.reportValidity()) return;

            alert(
                "Formulário preenchido com sucesso! " +
                "O envio de mensagens ainda não está configurado."
            );

            formulario.reset();

        }
    );

});
