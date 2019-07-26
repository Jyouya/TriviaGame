class Question {
    constructor(question, answer, ...wrongAnswers) {
        this.question = question;
        this.answer = answer;
        this.answers = [answer, ...wrongAnswers];
        // one line shuffle https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    }
    
    get options() {
        console.log(this.answers)
        return this.answers.reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []);
    }

    set options(arr) {
        this.answers = arr;
    }

}