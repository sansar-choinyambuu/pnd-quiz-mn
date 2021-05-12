<template>
  <!--container-->
  <section class="container">
    <!--questionBox-->
    <div class="questionBox" id="app">
      <!-- transition -->
      <transition-group :duration="{ enter: 500, leave: 300 }" name="question">
        <!--questionContainer-->
        <div
          class="questionContainer"
          v-if="questionIndex < quiz.questions.length"
          v-bind:key="questionIndex"
        >
          <header>
            <h1 class="title is-6">
              Төрсний дараах сэтгэл гутралыг өөрөө оношлох сорил
            </h1>

            <!--progress-->
            <div class="progressContainer">
              <progress
                class="progress is-info is-small"
                :value="(questionIndex / quiz.questions.length) * 100"
                max="100"
              >
                {{ (questionIndex / quiz.questions.length) * 100 }}%
              </progress>
              <p>
                {{ (questionIndex / quiz.questions.length) * 100 }}% хариулсан
              </p>
            </div>
            <!--/progress-->
          </header>

          <div class="pretitle">Өнгөрсөн долоо хоногт:</div>

          <!-- questionTitle -->
          <h2 class="titleContainer title">
            {{ questionIndex + 1 }}. {{ quiz.questions[questionIndex].text }}
          </h2>

          <!-- quizOptions -->
          <div class="optionContainer">
            <div
              class="option"
              v-for="(response, index) in quiz.questions[questionIndex]
                .responses"
              @click="selectOption(index)"
              :class="{
                'is-selected': userResponses[questionIndex] == index,
              }"
              :key="index"
            >
              {{ charIndex(index) }}. {{ response.text }}
            </div>
          </div>

          <!--quizFooter: navigation and progress-->
          <footer class="questionFooter">
            <!--pagination-->
            <nav class="pagination" role="navigation" aria-label="pagination">
              <!-- back button -->
              <button
                class="button"
                v-on:click="prev()"
                :disabled="questionIndex < 1"
              >
                Өмнөх
              </button>

              <!-- next button -->
              <button
                class="button"
                :class="userResponses[questionIndex] == null ? '' : 'is-active'"
                v-on:click="next()"
                :disabled="
                  userResponses[questionIndex] == null ||
                  questionIndex >= quiz.questions.length
                "
              >
                Дараагийн
              </button>
            </nav>
            <!--/pagination-->
          </footer>
          <!--/quizFooter-->
        </div>
        <!--/questionContainer-->

        <!--quizCompletedResult-->
        <div
          v-else-if="questionIndex >= quiz.questions.length"
          class="quizCompleted has-text-centered"
          v-bind:key="questionIndex"
        >
          <!--resultTitleBlock-->
          <h1 class="titleContainer">Сорилын хариу</h1>
          <h2 class="title" :hidden="score() < 13">
            Та ямар нэгэн байдлаар төрсний дараах сэтгэл гутралд өртсөн байна.
          </h2>
          <h2 class="title" :hidden="score() >= 13">
            Та төрсний дараах сэтгэл гутралд өртөөгүй, хэвийн байна.
          </h2>
          <p class="subtitle">
            Нийт оноо: {{ score() }} / {{ quiz.questions.length * 3 }}
          </p>
          <br />
          <a class="button" @click="restart()"
            >Дахих <i class="fa fa-refresh"></i
          ></a>
          <div class="info">
            <p>
              Төрсний дараах сэтгэл гутрал нь жирэмсэн болон хүүхэд төрүүлсний
              дараах хамгийн их тохиолддог хүндрэл юм. 10 асуулт бүхий
              Эдинбургийн Төрсний Дараах Сэтгэл Хямралын Сорил (EPDS) нь сэтгэл
              хямралын эрсдэлтэй өвчтөнүүдийг тодорхойлох хялбар бөгөөд, үр
              дүнтэй хэрэгсэл болох нь батлагдсан билээ. Сорилоос 13-аас дээш
              оноо авсан эхчүүд ямар нэгэн байдлаар сэтгэлийн хямралд өртсөн
              байх магадлалтай.
            </p>
            <p>
              Сорилд сэтгэл гутралтай гэж гарсан бол оношийг мэргэжлийн эмчийн
              нарийвчилсан оношлогоогоор баталгаажуулах хэрэгтэй. Сорилын оноо
              нь өмнөх долоо хоногт ээжид ямар мэдрэмж төрж байсныг харуулна.
              Эргэлзээтэй тохиолдолд 2 долоо хоногийн дараа сорилыг давтаж
              хийгээрэй.
            </p>
            <p>
              Төрсний дараах сэтгэл гутралтай эмэгтэй та ганцаардах
              шаардлагагүй. Та эдгээр вэбсайтуудаас хэрэгтэй мэдээллийг олж
              аваарай:
            </p>
            <a
              href="https://www.google.com/search?q=%D1%82%D3%A9%D1%80%D1%81%D0%BD%D0%B8%D0%B9+%D0%B4%D0%B0%D1%80%D0%B0%D0%B0%D1%85+%D1%81%D1%8D%D1%82%D0%B3%D1%8D%D0%BB+%D0%B3%D1%83%D1%82%D1%80%D0%B0%D0%BB&oq=%D1%82%D3%A9%D1%80%D1%81%D0%BD%D0%B8%D0%B9+%D0%B4%D0%B0%D1%80%D0%B0%D0%B0%D1%85+%D1%81%D1%8D%D1%82%D0%B3%D1%8D%D0%BB+%D0%B3%D1%83%D1%82%D1%80%D0%B0%D0%BB"
              >Хайлт</a
            >
          </div>
          <!--/resultTitleBlock-->
          <div class="source">
            <p>
              Эх сурвалж 1: Cox, J.L., Holden, J.M., and Sagovsky, R. 1987.
              Detection of postnatal depression: Development of the 10-item
              Edinburgh Postnatal Depression Scale. British Journal of
              Psychiatry 150:782-786 .
            </p>
            <p>
              Эх сурвалж 2: K. L. Wisner, B. L. Parry, C. M. Piontek, Postpartum
              Depression N Engl J Med vol. 347, No 3, July 18, 2002, 194-199
            </p>
          </div>
        </div>
        <!--/quizCompetedResult-->
      </transition-group>
    </div>
    <!--/questionBox-->
  </section>
  <!--/container-->
</template>

<script>
var quiz = {
  questions: [
    {
      text: "Би инээж, амьдралаас хөгжилтэй талыг нь олж харж чадаж байгаа",
      responses: [
        { text: "Урьдых шигээ хэвийн хэмжээнд", score: 0 },
        { text: "Хэвийн үеээс багассан", score: 1 },
        { text: "Хэвийн үеээс эрс багассан", score: 2 },
        { text: "Огт үгүй", score: 3 },
      ],
    },
    {
      text:
        "Би амьдралд минь тохиолдсон үйл явдалуудыг баяртайгаар догдлон хүлээж байсан",
      responses: [
        { text: "Урьдых шигээ хэвийн хэмжээнд", score: 0 },
        { text: "Хэвийн үеээс багассан", score: 1 },
        { text: "Хэвийн үеээс эрс багассан", score: 2 },
        { text: "Бараг огт үгүй", score: 3 },
      ],
    },
    {
      text:
        "Аливаа санаснаар болохгүй зүйлс тохиолдоход юуны түрүүнд өөртөө буруу өгсөн",
      responses: [
        { text: "Тийм, ихэвчлэн", score: 3 },
        { text: "Тийм, заримдаа", score: 2 },
        { text: "Тийм ч түгээмэл биш", score: 1 },
        { text: "Хэзээ ч тэгдэггүй", score: 0 },
      ],
    },
    {
      text: "Би учир шалтгаангүйгээр санаа зовсон, түгшсэн байдалтай байсан",
      responses: [
        { text: "Огт үгүй", score: 0 },
        { text: "Бараг л үгүй", score: 1 },
        { text: "Тийм, заримдаа", score: 2 },
        { text: "Тийм, байнга", score: 3 },
      ],
    },
    {
      text: "Би учир шалтгаангүйгээр айсан, цочирдсон байдалтай байсан",
      responses: [
        { text: "Тийм, нэлээн хэдэн удаа", score: 3 },
        { text: "Тийм, заримдаа", score: 2 },
        { text: "Үгүй, тийм ч их биш", score: 1 },
        { text: "Огт үгүй", score: 0 },
      ],
    },
    {
      text: "Барагдахгүй их ажил, даалгавруудад дарагдсан байдалтай байсан",
      responses: [
        {
          text: "Тийм, ихэнхидээ энэ их ажилын ард гарахад хэцүү байсан",
          score: 3,
        },
        {
          text:
            "Тийм, заримдаа ард нь урьдых шигээ амархан гарахад хэцүү байсан",
          score: 2,
        },
        { text: "Үгүй, ихэнхидээ би зохицуулж чадсан", score: 1 },
        { text: "Үгүй, урьдых шигээ хэвийн зохицуулж чадсан", score: 0 },
      ],
    },
    {
      text: "Үнэхээр гуниг, гутралтай байсан болохоор унтаж чадахгүй байсан",
      responses: [
        { text: "Тийм, ихэвчлэн", score: 3 },
        { text: "Тийм, заримдаа", score: 2 },
        { text: "Үгүй, тийм ч их биш", score: 1 },
        { text: "Огт үгүй", score: 0 },
      ],
    },
    {
      text: "Надад маш гунигтай, өөрийгөө өрөвдмөөр санагдаж байсан",
      responses: [
        { text: "Тийм, ихэвчлэн", score: 3 },
        { text: "Тийм, нэлээн их", score: 2 },
        { text: "Үгүй, тийм ч их биш", score: 1 },
        { text: "Огт үгүй", score: 0 },
      ],
    },
    {
      text: "Маш их гуниг, гутралтай байсны улмаас уйлсан",
      responses: [
        { text: "Тийм, ихэвчлэн", score: 3 },
        { text: "Тийм, нэлээн их", score: 2 },
        { text: "Хэдхэн удаа", score: 1 },
        { text: "Огт үгүй", score: 0 },
      ],
    },
    {
      text: "Амиа хорлох тухай бодол орж ирсэн",
      responses: [
        { text: "Тийм, нэлээн хэдэн удаа", score: 3 },
        { text: "Заримдаа", score: 2 },
        { text: "Бараг л үгүй", score: 1 },
        { text: "Огт үгүй", score: 0 },
      ],
    },
  ],
};
var userResponseSkeleton = Array(quiz.questions.length).fill(null);

export default {
  name: "Quiz",
  data() {
    return {
      quiz: quiz,
      questionIndex: 0,
      userResponses: userResponseSkeleton,
      isActive: false,
    };
  },

  methods: {
    charIndex: function (i) {
      return String.fromCharCode(97 + i);
    },
    restart: function () {
      this.questionIndex = 0;
      this.userResponses = Array(this.quiz.questions.length).fill(null);
    },
    selectOption: function (index) {
      this.userResponses[this.questionIndex] = index;
      //console.log(this.userResponses);
    },
    next: function () {
      if (this.questionIndex < this.quiz.questions.length) this.questionIndex++;
    },

    prev: function () {
      if (this.quiz.questions.length > 0) this.questionIndex--;
    },
    // Return sum of scores from user responses
    score: function () {
      var score = 0;
      for (let i = 0; i < this.userResponses.length; i++) {
        if (
          typeof this.quiz.questions[i].responses[this.userResponses[i]] !==
          "undefined"
        ) {
          score += this.quiz.questions[i].responses[this.userResponses[i]]
            .score;
        }
      }
      return score;
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$trans_duration: 0.3s;
$primary_color: #3d5afe;

@import url("https://fonts.googleapis.com/css?family=Montserrat:400,400i,700");
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700");

body {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;

  height: 100vh;

  background: #cfd8dc;

  /* mocking native UI */
  cursor: default !important; /* remove text selection cursor */
  user-select: none; /* remove text selection */

  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  transition: $trans_duration;
}
.title,
.subtitle {
  font-family: Montserrat, sans-serif;
  font-weight: normal;
}
.pretitle,
.info {
  padding-top: 1rem;
  font-family: Montserrat, sans-serif;
  font-weight: normal;
}

.question-enter-active,
.question-leave-active,
.question-move {
  transition: all $trans_duration ease;
  transition-property: opacity, transform;
}

.question-leave-active {
  position: absolute;
}

.question-leave-to {
  opacity: 0;
  transform-origin: center top;
}

.source {
  text-align: center;
  margin: 0 auto;
  padding: 1.5rem;
}

.container {
  margin: 0 0.5rem;
}

.questionBox {
  max-width: 30rem;
  width: 30rem;
  min-height: 30rem;

  background: #fafafa;
  position: relative;
  display: flex;

  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

  header {
    background: rgba(0, 0, 0, 0.025);
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    h1 {
      font-weight: bold;
      margin-bottom: 1rem !important;
    }
    .progressContainer {
      width: 60%;
      margin: 0 auto;
      > progress {
        margin: 0;
        border-radius: 5rem;
        overflow: hidden;
        border: none;

        color: $primary_color;
        &::-moz-progress-bar {
          background: $primary_color;
        }
        &::-webkit-progress-value {
          background: $primary_color;
        }
      }
      > p {
        margin: 0;
        margin-top: 0.5rem;
      }
    }
  }
  .titleContainer {
    text-align: center;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .quizForm {
    display: block;
    white-space: normal;

    height: 100%;
    width: 100%;

    .quizFormContainer {
      height: 100%;
      margin: 15px 18px;

      .field-label {
        text-align: left;
        margin-bottom: 0.5rem;
      }
    }
  }
  .quizCompleted {
    width: 100%;
    padding: 1rem;
    text-align: center;

    > .icon {
      color: #ff5252;
      font-size: 5rem;

      .is-active {
        color: #00e676;
      }
    }
  }
  .questionContainer {
    white-space: normal;

    height: 100%;
    width: 100%;

    .optionContainer {
      margin-top: 12px;
      flex-grow: 1;
      .option {
        border-radius: 290486px;
        padding: 9px 18px;
        margin: 0 18px;
        margin-bottom: 12px;
        transition: $trans_duration;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.85);
        border: transparent 1px solid;

        &.is-selected {
          border-color: rgba(black, 0.25);
          background-color: white;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        &:active {
          transform: scaleX(0.9);
        }
      }
    }

    .questionFooter {
      background: rgba(0, 0, 0, 0.025);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      align-self: flex-end;

      .pagination {
        //padding: 10px 15px;
        margin: 15px 25px;
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: space-between;
}
.button {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 5rem;
  margin: 0 0.25rem;
  font-size: large;

  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background: #eceff1;
    border-color: rgba(0, 0, 0, 0.25);
  }
  &.is-active {
    background: $primary_color;
    color: white;
    border-color: transparent;

    &:hover {
      background: darken($primary_color, 10%);
    }
  }
}

@media screen and (min-width: 320px) {
  .questionBox {
    align-items: center;
    justify-content: center;

    .questionContainer {
      display: flex;
      flex-direction: column;
    }
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    height: auto !important;
    border-radius: 6px 6px 0px 0px;
  }
}
</style>
