const model = (() => {

   let data = {
      current: {
         subject: '',
         totalQuestions: 0,
         questionArray: [],
         correctArray: [],
         correct: 0,
         incorrect: 0,
         isQuestionInitiated: false,
         streak: 0,
         wasPreviousCorrect: false
      },

      overall: {
         TotalQuestions: 0,
         TotalCorrect: 0,
         TotalIncorrect: 0
      }
   }

   const subjects = ['bangla-1', 'bangla-2', 'english-1', 'english-2', 'math', 'higher-math', 'physics', 'chemistry', 'biology']
   const subjectsText = ['Bangla-1', 'Bangla-2', 'English-1', 'English-2', 'Math', 'Higher Math', 'Physics', 'Chemistry', 'Biology']
   subjects.forEach(cur => {
      data.overall[cur] = {
         totalQuestions: 0,
         correct: 0,
         incorrect: 0,
         correctPercentage: 0,
         incorrectPercentage: 0
      }
   })

   const updateLocalStorage = () => {
      const obj = {
         overall: data.overall,
         nickname: data.nickname
      }
      localStorage.setItem('data', JSON.stringify(obj))
   }

   const localData = JSON.parse(localStorage.getItem('data'))
   if (localData && localData.overall.isCompleted) {
      data.overall = localData.overall
      // console.log(localData)
      data.nickname = localData.nickname
   } else {
      const obj = {
         overall: data.overall,
         nickname: data.nickname
      }
      obj.overall.isCompleted = true
      localStorage.setItem('data', JSON.stringify(obj))
   }

   data.calculateSubjectProgress = (category, subject) => {
      // console.log(data)
      if (category == 'current') {
         data.current.correctPercentage = Math.round((data.current.correct / data.current.totalQuestions) * 100)

         data.current.incorrectPercentage = 100 - data.current.correctPercentage
      } else if (category == 'overall') {
         const dataSubject = data.overall[subject]
         // console.log(dataSubject)
         if (!dataSubject) data.overall[subject] = {}
         data.overall[subject].correctPercentage = Math.round((dataSubject.correct / dataSubject.totalQuestions) * 100)

         data.overall[subject].incorrectPercentage = 100 - dataSubject.correctPercentage
      }


      data.overall.TotalAccuracy = Math.round((data.overall.TotalCorrect / data.overall.TotalQuestions) * 100) 

      updateLocalStorage()
   }


   return {
      isProfileInitiated: () => {
         const localStorageData = JSON.parse(localStorage.getItem('data'))

         if (localStorageData) {
            if (localStorageData.nickname) return localStorageData.nickname
         } else return false
      },

      updateLocalStorage: () => {
         updateLocalStorage()
      },

      setData: (property, value) => {
         data[property] = value
         updateLocalStorage()
      },

      getSubjects: () => {
         return subjects
      },

      getSubjectsTexts: () => {
         return subjectsText
      },

      getCurrentSubject: () => {
         return data.current.subject
      },

      getCurrentSubjectText: () => {
         return data.current.subjectText
      },

      getName: () => {
         return JSON.parse(localStorage.getItem('data')).nickname
      },

      getProperty: () => {

      },

      pickQuestion: (start, end) => {
         start = parseInt(start)
         end = parseInt(end)

         data.current.questionArray = new Array(end - (start - 1)).fill().map((d, i) => i + start);
         
         let questionArr = data.current.questionArray

         questionArr = questionArr.filter( function( el ) {
            return !data.current.correctArray.includes( el );
         });
         // console.log(questionArr, data.current.correctArray)
          

         let questionNo = questionArr[Math.floor(Math.random() * questionArr.length)]
         data.current.questionNo = questionNo

         if (!data.current.isQuestionInitiated) data.current.isQuestionInitiated = true

         if (questionNo) return questionNo
         else return false

      },

      correctAnswerReceived: () => {
         const subject = data.current.subject

         data.current.streak ++

         data.current.totalQuestions ++
         data.overall.TotalQuestions ++
         data.overall[data.current.subject].totalQuestions ++
         
         data.current.correct ++
         data.overall.TotalCorrect ++
         data.overall[data.current.subject].correct ++

         // console.log(data.current.questionNo)
         data.current.correctArray.push(data.current.questionNo)
         // console.log(data.current.correctArray)


         data.calculateSubjectProgress('current')
         data.calculateSubjectProgress('overall', subject)
      },

      incorrectAnswerReceived: () => {
         const subject = data.current.subject

         data.current.streak = 0

         data.current.totalQuestions ++
         data.overall.TotalQuestions ++
         data.overall.TotalIncorrect ++
         data.overall[data.current.subject].totalQuestions ++
         data.overall[data.current.subject].incorrect ++

         data.calculateSubjectProgress('current')
         data.calculateSubjectProgress('overall', subject)
      },

      isQuestionInitiated: () => {
         return data.current.isQuestionInitiated
      },

      getTotalQuestionsNo: () => {
         return data.current.totalQuestions
      },

      updateOverallData: (subject, property, value) => {
         data.overall[subject][property] = value
         data.calculateSubjectProgress('overall', 'subject')
         updateLocalStorage()
      },

      updateCurrentData: (property, value) => {
         data.current[property] = value
         data.calculateSubjectProgress('current')
         updateLocalStorage()
      },

      resetCurrentData: () => {
         data.current = {
            correct: 0,
            correctArray: [],
            incorrect: 0,
            isQuestionInitiated: false,
            questionArray: [],
            streak: 0,
            subject: data.current.subject,
            subjectText: data.current.subjectText,
            totalQuestions: 0,
            wasPreviousCorrect: false
         }
      },

      getStat: (category) => {
         if(category == 'current') {
            return data.current
         } else if (category == 'overall') {
            return data.overall
         }
      },

      getData: () => {
         return data
      }
   }
})()




const ui = (() => {
   const DOM = {
      container1: document.querySelector('.container-1'),
      container2: document.querySelector('.container-2'),
      container3: document.querySelector('.container-3'),
      next1: document.querySelector('.next-1'),
      nicknameInput: document.querySelector('#nickname'),
      overallAccuracy2: document.querySelector('.stat-report .overall-accuracy'),
      totalQuestion2: document.querySelector('.stat-report .total-questions'),
      correct2: document.querySelector('.stat-report .correct'),
      incorrect2: document.querySelector('.stat-report .incorrect'),
      name2: document.querySelector('.container-2 .right__cont .top h4'),
      pickSubjectsButtons: document.querySelectorAll('.container-2 .left__cont .middle ul li'),

      name3: document.querySelector('.container-3 .right__cont .top h4'),
      subject3: document.querySelector('.container-3 .right__cont .top p strong'),
      subjectGraphCorrect: document.querySelector('.container-3 .right__cont .middle .graph__cont .correct-graph'),
      subjectGraphIncorrect: document.querySelector('.container-3 .right__cont .middle .graph__cont .incorrect-graph'),
      correctPercentage3: document.querySelector('.container .right__cont .middle .stats__cont .correct h4'),
      correct3: document.querySelector('.container .right__cont .middle .stats__cont .correct p:nth-child(3)'),
      incorrectPercentage3: document.querySelector('.container .right__cont .middle .stats__cont .incorrect h4'),
      incorrect3: document.querySelector('.container .right__cont .middle .stats__cont .incorrect p:nth-child(3)'),
      totalQuestion3: document.querySelector('.total-questions-3'),

      questionNo: document.querySelector('#question_no'),
      streakCont: document.querySelector('.streak__cont'),
      buttonsCont: document.querySelector('.container .left__cont .middle .buttons'),
      questionStartInput: document.querySelector('#start'),
      questionEndInput: document.querySelector('#end'),
      progress3: document.querySelector('.container-3 .right__cont .bottom'),

      max: document.querySelector('.max'),
      min: document.querySelector('.min'),
      skipBtn: document.querySelector('.skip__btn'),
      questionPickCont: document.querySelector('.question-pick'),
      pickRandomSubBtn: document.querySelector('.pick-random-subject__btn'), 
      subjectName: document.querySelector('.subject-name'),

      homeBtn: document.querySelector('#home_btn'),
      deleteBtn: document.querySelector('#delete_btn'),

      sessionTotalQuestions: document.querySelector('.session-total-question'),
      sessionCorrect: document.querySelector('.session-correct'),
      sessionIncorrect: document.querySelector('.session-incorrect'),
      sessionAccuracy: document.querySelector('.session-accuracy'),
      resetSessionBtn: document.querySelector('#reset-session__btn'),
   }

   const updatedDOM = () => {
      return {
         nextQuestionButtons: document.querySelectorAll('.next-question__btn'),
         correctBtn: document.querySelector('#correct_btn'),
         incorrectBtn: document.querySelector('#incorrect_btn'),
         resetSessionButtons: document.querySelectorAll('.reset-session__btn')   
      }
   }


   return {
      getDOM: () => {
         return DOM
      },

      getUpdatedDOM: () => {
         return updatedDOM()
      },

      showCont: num => {
         DOM[`container${num}`].style.display = 'flex'
      },

      closeCont: num => {
         DOM[`container${num}`].style.display = 'none'
      },

      renderName: (name, cont) => {
         cont.textContent = `Hi ${name}!`
      },

      renderSubjectsGraph: (subjects, data, subjectsText=model.getSubjectsTexts()) => {
         // console.log(subjectsText)
         subjects.forEach(cur => {
            if (cur == 'higher-math') {
               document.querySelector(`.stats__cont .${cur} h4`).textContent = 'H. Math'
            } else {
               document.querySelector(`.stats__cont .${cur} h4`).textContent = cur
            }

            if (data[cur].totalQuestions > 0) document.querySelector(`.stats__cont .${cur} p`).textContent = data[cur].correctPercentage 
            else document.querySelector(`.stats__cont .${cur} p`).textContent = 'N/A'

            document.querySelector(`.graph__cont .${cur}`).style.height = data[cur] ? `${data[cur].correctPercentage}%` : '0'

            if (data[cur].correctPercentage >= 90) {
               document.querySelector(`.graph__cont .${cur}`).style.background = '#007ac1'
            } else if (data[cur].correctPercentage >= 80 && data[cur].correctPercentage < 90) {
               document.querySelector(`.graph__cont .${cur}`).style.background = '#2EB086'
            } else if (data[cur].correctPercentage >= 60 && data[cur].correctPercentage < 80) {
               document.querySelector(`.graph__cont .${cur}`).style.background = 'rgb(241 215 29)'
            } else if (data[cur].correctPercentage < 60) {
               document.querySelector(`.graph__cont .${cur}`).style.background = '#FC4F4F'
            }
         })
         
         DOM.overallAccuracy2.textContent = data.TotalAccuracy || 'N/A'
         DOM.totalQuestion2.textContent = data.TotalQuestions || 0
         DOM.correct2.textContent = data.TotalCorrect || 0
         DOM.incorrect2.textContent = data.TotalIncorrect || 0

         let min = 100
         let minItem = {}
         subjects.forEach(cur => {
            if (data[cur].totalQuestions > 9) {
               if (data[cur].correctPercentage < min) {
                  min = data[cur].correctPercentage
                  minItem = data[cur]
                  minItem.subject = cur
               }
            }
         })

         let max = 0
         let maxItem = {}
         subjects.forEach(cur => {
            if (data[cur].totalQuestions > 9 && data[cur].correctPercentage > 65) {
               if (data[cur].correctPercentage > max) {
                  max = data[cur].correctPercentage
                  maxItem = data[cur]
                  maxItem.subject = cur
               }
            }
         })
         // console.log(maxItem)
         


         if (max > 65 && maxItem.subject != minItem.subject) {
            DOM.max.innerHTML = `You are <span class="progress-blue">THE BEST</span> in ${subjectsText[subjects.indexOf(maxItem.subject)]}!`
         } else if (max > 65 && minItem.subject == maxItem.subject && max > 80) {
            DOM.max.innerHTML = `You are <span class="progress-blue">THE BEST</span> in ${subjectsText[subjects.indexOf(maxItem.subject)]}!`
         } else {
            DOM.max.innerHTML = `Practice makes a man perfect! (Woman too)`
         }


         if (min >= 90) {
            DOM.min.innerHTML = `You certainly do have a stunning preparation`
         } else if (min < 90 && minItem.subject != maxItem.subject) {
            DOM.min.innerHTML = `${subjectsText[subjects.indexOf(minItem.subject)]} <span class="progress-red">needs some improvement.</span> Keep practicing~`
         } else {
            DOM.min.innerHTML = `Keep practicing to know your weak points~`
         }
      },


      renderSubjectGraph: (subject, subjectText, data) => {
         DOM.subject3.textContent = subjectText

         // console.log(data.correct)
         DOM.subjectGraphCorrect.style.height = data.correct ? `${data.correctPercentage}%` : '0'
         DOM.subjectGraphIncorrect.style.height = data.incorrect ? `${data.incorrectPercentage}%` : '0'

         if (data.totalQuestions > 0) {
            DOM.correctPercentage3.textContent = `${data.correctPercentage}%`
            DOM.incorrectPercentage3.textContent = `${data.incorrectPercentage}%` 
 
         } else {
            DOM.correctPercentage3.textContent = 'N/A'
            DOM.incorrectPercentage3.textContent = 'N/A'
         }

         DOM.correct3.textContent = data.correct || 0
         DOM.incorrect3.textContent = data.incorrect || 0

         DOM.totalQuestion3.textContent = data.totalQuestions || 0

         // console.log(data.streak)
         if (data.streak > 2) {
            const streakMarkup = `
            <span style="--i:1">${data.streak}</span>
            &nbsp
            <span style="--i:2">I</span>
            <span style="--i:3">N</span>
            &nbsp
            <span style="--i:4">A</span>
            &nbsp
            <span style="--i:5">R</span>
            <span style="--i:6">O</span>
            <span style="--i:7">W</span>
            <span style="--i:8">!</span>
            `

            DOM.streakCont.innerHTML = streakMarkup
         } else {
            const streakMarkup = `
            <span style="--i:1">.</span>
            <span style="--i:2">.</span>
            <span style="--i:3">.</span>
            <span style="--i:4">.</span>
            <span style="--i:5">.</span>
            <span style="--i:6">.</span>
            <span style="--i:7">.</span>
            <span style="--i:8">.</span>
            `

            DOM.streakCont.innerHTML = streakMarkup
         }

         if (data.currentTotalQuestions > 9) {
            const progress = data.correctPercentage - data.previousAccuracy

            let markup = ''
            if (progress > 0) {
               markup = `<h4>You are doing <span class="progress progress-blue">${progress}% better</span> than your average!</h4>
               `
            } else if (progress < 0) {
               markup = `<h4>Your accuracy now is <span class="progress progress-red">${progress * -1}% less</span> than your average</h4>
               `
            } else if (progress == 0) {
               markup = `<h4>Looks like you're carrying on your average form~</h4>`
            }

            if (data.previousAccuracy) DOM.progress3.innerHTML = markup
            else DOM.progress3.innerHTML = `<h4>This is your first time in this subject</h4>`
         } else {
            DOM.progress3.innerHTML = `<h4>Keep going~</h4>`
         }


         DOM.sessionTotalQuestions.textContent = data.currentTotalQuestions
         DOM.sessionCorrect.textContent = data.currentCorrect
         DOM.sessionIncorrect.textContent = data.currentIncorrect
         DOM.sessionAccuracy.textContent = Math.round((data.currentCorrect / data.currentTotalQuestions) * 100) || 'N/A'
      },


      renderPickQuestionCont: subjectText => {
         const streakMarkup = `
         <span style="--i:1">.</span>
         <span style="--i:2">.</span>
         <span style="--i:3">.</span>
         <span style="--i:4">.</span>
         <span style="--i:5">.</span>
         <span style="--i:6">.</span>
         <span style="--i:7">.</span>
         <span style="--i:8">.</span>
         `

         const pickQuestionBtnMarkup = `
         <button class="roll-the-dice__btn next-question__btn">
            <svg>
                  <use href="./icons.svg#icon__pencil-post"></use>
            </svg>
            
            <span>Roll the dice</span>                 
         </button>
         `

         DOM.questionNo.textContent =  0
         DOM.questionNo.classList.remove('all-done-message')
         DOM.streakCont.innerHTML = streakMarkup
         DOM.buttonsCont.innerHTML = pickQuestionBtnMarkup
         DOM.skipBtn.style.display = 'none'
         DOM.subjectName.textContent = subjectText
      },


      renderQuestionNo: (isQuestionInitiated, questionNo) => {
         if (questionNo) {
            DOM.questionNo.textContent = questionNo
            DOM.questionNo.classList.remove('all-done-message')

            const pickQuestionBtnMarkup = `
            <button class="incorrect next-question__btn" id="incorrect_btn">
               <span>Wrong</span>
               
               <svg>
                  <use href="./icons.svg#icon__cross"></use>
               </svg>
            </button>
   
            <button class="correct next-question__btn" id="correct_btn" type="button">
               <svg>
                  <use href="./icons.svg#icon__check"></use>
               </svg>
   
               <span>Correct</span>
            </button>
            `
   
            if (isQuestionInitiated && DOM.buttonsCont.innerHTML != pickQuestionBtnMarkup)  {
               DOM.buttonsCont.innerHTML = pickQuestionBtnMarkup
               DOM.skipBtn.style.display = 'inline'
            }
         } else {
            DOM.questionNo.textContent = 'You are all done!'
            DOM.questionNo.classList.add('all-done-message')
            DOM.streakCont.style.display = 'none'
            DOM.resetSessionBtn.style.display = 'none'

            const pickQuestionBtnMarkup = `
            <button class="reset-session__btn reset-session-question-cont__btn">
               <span>Reset session</span>
            </button>
            `
   
            DOM.buttonsCont.innerHTML = pickQuestionBtnMarkup
            DOM.skipBtn.style.display = 'none'
         }
      }
   }
})()




const controller = ((model, ui) => {
   const DOM = ui.getDOM()

   const generateQuestionCtrl = (start, end) => {
      const questionNo = model.pickQuestion(start, end)

      const isQuestionInitiated = model.isQuestionInitiated()
      ui.renderQuestionNo(isQuestionInitiated, questionNo)
      const totalQuestions = model.getTotalQuestionsNo()
      // console.log(totalQuestions)
      setupNextQuestionEventListeners()
      // console.log(questionNo)
      if (!questionNo) setupResetSessionEventListeners()
   }

   const renderCont2 = () => {
      ui.showCont(2)
      
      DOM.homeBtn.style.display = 'none'
      DOM.deleteBtn.style.display = 'inline'
      DOM.resetSessionBtn.style.display = 'none'

      ui.renderName(model.getName(), DOM.name2)


      const data = model.getStat('overall')
      ui.renderSubjectsGraph(model.getSubjects(), data)

      DOM.questionPickCont.style.display = 'none'
   }

   const setupNextQuestionEventListeners = () => {
      Array.from(ui.getUpdatedDOM().nextQuestionButtons).forEach(cur => {
         cur.addEventListener('click', e => {
            if (!cur.getAttribute('listener')) {
               cur.setAttribute('listener', true)

               if (cur.id == 'correct_btn') {
                  model.correctAnswerReceived()
               } else if (cur.id == 'incorrect_btn') {
                  model.incorrectAnswerReceived()
               }


               const start = parseInt(DOM.questionStartInput.value)
               const end = parseInt(DOM.questionEndInput.value)
               console.log(start, end)
               if (start > 0 && end > 0 && (end > start)) {
                  console.log('a')
                  generateQuestionCtrl(start, end)
               } else {
                  console.log(start, end)
                  alert('Invalid range')
               }
               
               updateSubjectGraph(model.getCurrentSubject(), model.getCurrentSubjectText())   
            }
         })
      })


      if (!DOM.skipBtn.getAttribute('listener')) {
         DOM.skipBtn.addEventListener('click', () => {
            DOM.skipBtn.setAttribute('listener', true) 
            const start = parseInt(DOM.questionStartInput.value)
            const end = parseInt(DOM.questionEndInput.value)
            if (start > 0 && end > 0 && (end > start)) {
               console.log(start, end)
               generateQuestionCtrl(start, end)
            } else {
               alert('Invalid range')
            }
         })
      }
   }


   const updateSubjectGraph = (subject, subjectText) => {
      const data = model.getStat('overall')[subject]
      const curData = model.getStat('current')
      ui.renderSubjectGraph(subject, subjectText, {
         correct: data.correct,
         correctPercentage: data.correctPercentage,
         incorrect: data.incorrect,
         incorrectPercentage: data.incorrectPercentage ,
         totalQuestions: data.totalQuestions,
         currentTotalQuestions: curData.totalQuestions,
         currentCorrect: curData.correct,
         currentIncorrect: curData.incorrect,
         streak: curData.streak,
         previousAccuracy: curData.previousAccuracy
      })
   }


   const renderCont3 = (subject, subjectText) => {
      DOM.questionPickCont.style.display = 'flex'
      DOM.homeBtn.style.display = 'inline'
      DOM.deleteBtn.style.display = 'inline'
      DOM.resetSessionBtn.style.display = 'inline'

      model.updateCurrentData('subject', subject)
      model.updateCurrentData('subjectText', subjectText)
      model.updateCurrentData('streak', 0)

      // console.log(model.getStat('overall'))
      model.updateCurrentData('previousAccuracy', model.getStat('overall')[subject].correctPercentage)

      ui.showCont(3)
      ui.renderName(model.getName(), DOM.name3)
      ui.renderPickQuestionCont(subjectText)

      updateSubjectGraph(subject, subjectText)
      setupNextQuestionEventListeners()
      // console.log('a')
   }
   

   const resetSessionCtrl = () => {
      model.resetCurrentData()

      renderCont3(model.getCurrentSubject(), model.getCurrentSubjectText())
   }

   const setupResetSessionEventListeners = () => {
      // console.log('aasf')
      Array.from(ui.getUpdatedDOM().resetSessionButtons).forEach(cur => {
         if (!cur.getAttribute('listener')) {
            cur.addEventListener('click', () => {
               resetSessionCtrl()
            })
            cur.setAttribute('listener', true)
         }
      })
   }



   const initiateApp = () => {
      if (model.isProfileInitiated()) {
         renderCont2()
      } else {
         ui.showCont(1)
      }
   }

   const setupEventListeners = () => {
      DOM.next1.addEventListener('click', e => {
         e.preventDefault()

         if (DOM.nicknameInput.value) {
            model.setData('nickname', DOM.nicknameInput.value)
            ui.closeCont(1)
            renderCont2()
         } else {
            alert('Please write your nickname to proceed')
         }
      })


      Array.from(DOM.pickSubjectsButtons).forEach(cur => {
         cur.addEventListener('click', () => {
            const subject = cur.className
            const subjectText = cur.textContent

            ui.closeCont(2)
            renderCont3(subject, subjectText)
         })
      })


      DOM.pickRandomSubBtn.addEventListener('click', () => {
         const subjects = model.getSubjects()
         const subject = subjects[Math.floor((Math.random() * subjects.length))]
         const subjectText = model.getSubjectsTexts().find((item, i) => i == subjects.indexOf(subject))
         // console.log(subject, subjectText)
         ui.closeCont(2)
         renderCont3(subject, subjectText)
      })


      DOM.homeBtn.addEventListener('click', () => {
         ui.closeCont(3)
         renderCont2()
      })

      DOM.deleteBtn.addEventListener('click', () => {
         if (confirm('Are you sure you want to erase all your data?') == true) {
            localStorage.clear()
            location.reload()
         }
      })

      Array.from(ui.getUpdatedDOM().resetSessionButtons).forEach(cur => {
         cur.addEventListener('click', () => {
            resetSessionCtrl()
         })
      })
   }

   
   return {
      init: () => {
         initiateApp()
         setupEventListeners()
      }
   }
})(model, ui).init()

window.getData = model.getData()
