//  const VARIABLES for storing tags
const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTag = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".row i");

//  for reducing HTML code lines , options of languages
(translateBtn = document.querySelector("button")),
    selectTag.forEach((tag, id) => {
        for (let langCode in languages) {
            let selected =
                id == 0
                    ? langCode == "uz-UZ"
                        ? "selected"
                        : ""
                    : langCode == "en-GB"
                    ? "selected"
                    : "";
            let option = `<option ${selected} value="${langCode}">${languages[langCode]}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
        }
    });

// for exchanging two languages on exchange-icon click
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

//  for clearing the translation when the text is cleared
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});
// for filling  the translation area when translate button is clicked
translateBtn.addEventListener("click", () => {
    document.querySelector("button").style.boxShadow =
        "8px 8px rgba(0, 0, 255, .2)";
    setTimeout(() => {
        document.querySelector("button").style.boxShadow = "";
        document.querySelector("button").style.background = "#00425A";
    }, 250);

    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) {
        return;
    }
    toText.setAttribute("placeholder", "Loading...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            toText.value = data.responseData.translatedText;
            console.log(data);
            data.matches.forEach((data) => {
                console.log(data);
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
            toText.style.background = "rgb(0, 128, 0)";
            toText.style.color = "#00ABB3";
            console.log("toText.value: ", toText.value);
            if (toText.value) {
                setTimeout(function () {
                    toText.style.color = "#434242";
                    toText.style.background = "#1F8A70";
                }, 2000);
            }
        });
});
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        // for copying the text or the translation to the clipboard
        if (!fromText.value || !toText.value) {
            return;
        }
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else
        {
            // for making a voice
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
