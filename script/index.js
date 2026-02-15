const loadlesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => {
            displayLesson(json.data);
            manageSpinner(false);
        })
};

const pronounceWord = (text, langType) => {
    const utterance = new SpeechSynthesisUtterance(text);

    if (langType === "bn") {
        utterance.lang = "bn-BD";   // Bangla
    } else {
        utterance.lang = "en-US";   // English
    }

    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
};


const removeActiveClass = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"));
 }

const loadLevelWord = (id)=>{
    manageSpinner(true);
    const url = `
    https://openapi.programming-hero.com/api/level/${id}
    `
    fetch(url)
    .then(res => res.json())
    .then(data =>{
        removeActiveClass();
        const clickbtn = document.getElementById(`lesson-btn-${id}`);
        
        clickbtn.classList.add("active");
            displayLevelWord(data.data)

    });
};

const manageSpinner=(status)=>{
    if(status==true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }

const loadWordDetail = async(id)=>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetail(details.data);
};
const displayWordDetail = (word)=>{
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
            <h2 class="text-2xl font-bold">
            ${word.word}(<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
        </div>
        <div class="">
            <h2 class=" font-bold">Meaning</h2>
            <p>${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}</p>
        </div>
        <div class="">
            <h2 class=" font-bold">Example</h2>
            <p>${word.sentence ? word.sentence : "উদাহরণ পাওয়া যায়নি"}</p>
        </div>
    <div class="">
    <h2 class="font-bold">Synonyms</h2>
    ${
        word.synonyms && word.synonyms.length > 0
        ? word.synonyms.map(syn => `<span class="btn">${syn}</span>`).join("")
        : "<p>কোনো সিননাইম পাওয়া যায়নি</p>"
    }
    </div>

   
    `;
    document.getElementById("my_modal_5").showModal();

};

       
const displayLevelWord=(words)=>{
    const wordContainer= document.getElementById("word-container");
    wordContainer.innerHTML = "";

if(words.length==0)
{
    wordContainer.innerHTML = `
    <div class="text-center bg-sky-100 col-span-full rounded-xl py-10 space-y-6">
        <img class="mx-auto" src="./assets/alert-error.png" >
        <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl">একটি Lesson Select করুন।</h2>
    </div>
    `
    manageSpinner(false);
    return;
    
}

    words.forEach(word => {
        console.log(word);
        const card=document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-x-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning/Pronunciations</p>

            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}', 'en')" 
class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
    <i class="fa-solid fa-volume-high"></i>
</button>

            </div>
        </div>
        `
        wordContainer.append(card);
    });
    manageSpinner(false);
};


const displayLesson = lessons => {
//1.get the container & empty
const levelContainer = document.getElementById("level-container");
levelContainer.innerHTML = "";

//2.get into every lessons
for(let lesson of lessons){
    //3.create element
    console.log(lesson);
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}"
     onclick="loadLevelWord(${lesson.level_no})" 
    class="btn btn-soft btn-primary lesson-btn">
    <i class="fa-solid fa-book-open"></i>
    Lesson - ${lesson.level_no}
    </button>

    `
    
//4.append
    levelContainer.append(btnDiv);
}
};


loadlesson();