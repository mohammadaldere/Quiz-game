// Select Element

let countSpan = document.querySelector(".count span");

let bullets=document.querySelector(".bullets");

let bulletsSpanContainer = document.querySelector(".bullets .spans");

let quizArea=document.querySelector(".quiz-area");

let answersArea=document.querySelector(".answers-area");

let submitButton=document.querySelector(".submit-button");


let resultContainer=document.querySelector(".results");

let countdownElement=document.querySelector(".countdown");


//set option 

let currentIndex=0;
let rightAnswers=0; 
let countdownInterval;
function getQuestion(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange=function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject=JSON.parse(this.responseText);

            let qCount= questionsObject.length;

            //create bullets + set question Count
            createBullets(qCount);

            //Add Question Data
            addQuestionData(questionsObject[currentIndex],qCount);
            //countdown start
            countdown(150,qCount);
            //click on button 
            submitButton.onclick=()=>{
                //Get Right Answer 
                let theRightAnswer=questionsObject[currentIndex].right_answer;

                //Increase Index 
                currentIndex++;

                //Check the answer
                CheckAnswer(theRightAnswer,qCount);

                //Remove Previous Question
                quizArea.innerHTML="";
                answersArea.innerHTML="";

                //Add Question Data
                
                addQuestionData(questionsObject[currentIndex],qCount);

                //Handle Bullets Class
                handleBullets();

                //countdown start
                clearInterval(countdownInterval);
                countdown(150,qCount);
 
                //show results
                showResults(qCount);


            }
        }
    };
  
    myRequest.open("GET","htm-qusetion.json",true);
    myRequest.send();
}

getQuestion();

function createBullets(num){
 countSpan.innerHTML=num;

 //create spans
 for(let i =0;i<num;i++){

    let theBullet = document.createElement("span");
    //check if its first span
    if(i===0){
        theBullet.className='on';
    }

    // Append Bullets TO mainDiv Bullet Container 
    bulletsSpanContainer.appendChild(theBullet);
 }
}

function addQuestionData(obj , count){
    if(currentIndex < count) {  
    //Create h2 Question Title
    let questionTitle = document.createElement("h2");

    //Create Question Text 
    let quetionText = document.createTextNode(obj["title"]);

    //Appent Text to H2
    questionTitle.appendChild(quetionText);

    //Append H2 to Quiz area 
    quizArea.appendChild(questionTitle);

    //create the answers
    for(let i=1; i<=4;i++){
       
        //create Main Answer Div 
        let mainDiv=document.createElement("div");

        //Add Class TO Main Div
        mainDiv.className='answer';

        //Create Radio Input
        let radioInput=document.createElement("input");
    
        //Add Type + Name + Id + Data-Attribute

        radioInput.name='question';
        radioInput.type='radio';
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=obj[`answer_${i}`];

        //Make first option selected 

        if(i===1){
            radioInput.checked=true;
        }
  
        //Create Label Input
        let theLabel=document.createElement("label");

        //Add For Attribute
        theLabel.htmlFor = `answer_${i}`;


        //Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        //Add Text TO Label 
        theLabel.appendChild(theLabelText);

        //Add Input + Radio To Main Div 

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
      
        //Append All Divs To Answer Area

        answersArea.appendChild(mainDiv)

        
    }
}

}

function CheckAnswer(rAnswer,count){
     let answers=document.getElementsByName("question")

     let theChoosenAnswer;

     for(let i=0 ; i<answers.length;i++){

        if(answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;
        }

        
     }
     if(rAnswer===theChoosenAnswer){
        rightAnswers++;
    }
} 

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from (bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{

        if(currentIndex===index){
            span.className="on";
        }
    });
}

function showResults(count){
    let theResults;
    if(currentIndex===count){

        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers>count/2 && rightAnswers<count){
            theResults = `<span class="good">Good</span> , ${rightAnswers} From ${count} `
        }else if (rightAnswers===count){
            theResults = `<span class="perfect">Perfect</span> , ${rightAnswers} From ${count}  All Answers Is Good. `
        }else{
            theResults = `<span class="bad">Bad</span> , ${rightAnswers} From ${count}    `
        }
        
        resultContainer.innerHTML=theResults;
        resultContainer.style.padding="10px";
        resultContainer.style.backgroundColor="white";
        resultContainer.style.marginTop="10px";


    }
}

function countdown(duration,count){
    if(currentIndex<count){
        let minutes,seconds;
        countdownInterval = setInterval(function(){
          minutes=parseInt(duration / 60);
          seconds=parseInt(duration % 60);

          minutes= minutes<10? `0${minutes}`:minutes;
          seconds= seconds<10? `0${seconds}`:seconds;

          countdownElement.innerHTML= `${minutes}:${seconds}`;

          if(--duration<0){
              clearInterval(countdownInterval);
              submitButton.click();
          }
        },1000);
    }
}