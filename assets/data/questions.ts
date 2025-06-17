import { type Question, QuestionType } from "../../types/question";

export const conversationQuestions: Question[] = [
  {
    id: 1,
    title: "Amazina",
    type: QuestionType.TEXT_INPUT,
    placeholder: "Andika hano",
  },
  {
    id: 2,
    title: "Imyaka",
    type: QuestionType.TEXT_INPUT,
    placeholder: "Andika hano",
    keyboardType: "numeric",
  },
  {
    id: 3,
    title: "Igitsina",
    type: QuestionType.RADIO,
    options: ["Gabo", "Gore"],
  },
  {
    id: 4,
    title: "Umwuga akora",
    type: QuestionType.TEXT_INPUT,
    placeholder: "Andika hano",
  },
  {
    id: 5,
    title: "Amashuri yize",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Amashuri abanza",
      "Amashuri yisumbuye",
      "Kaminuza",
      "Imyuga",
      "Ntabwo nize",
    ],
    placeholder: "Hitamo",
  },
  {
    id: 6,
    title: "Imiterere y’abashakanye",
    type: QuestionType.RADIO,
    options: ["Ingaragu", "Uwashatse", "Uwatandukanye", "Uwapfakaye"],
  },
  {
    id: 7,
    title: "Umurwayi yahawe taransiferi?",
    type: QuestionType.RADIO,
    options: ["Yego", "Oya"],
  },
  {
    id: 8,
    title: "Ni izihe ndwara zidakira arwara?",
    type: QuestionType.TEXT_INPUT,
    multiline: true,
    placeholder: "Utandukanye indwara ukoresheje: ,",
  },
];

export const followupQuestions: Question[] = [
  {
    id: 1,
    title:
      "Wabashije gukurikiza inama z’ubuzima cyangwa gahunda yo kuvurwa wahawe n’umujyanama w’ubuzima?",
    type: QuestionType.RADIO,
    options: ["Yego", "Oya"],
  },
  {
    id: 2,
    title:
      "Uriyumva ute nyuma y’ibyumweru bibiri uhuye n’umujyanama w’ubuzima?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Narakize neza (Ndi kumva meze neza)",
      "Ndacyarwaye ariko ndi kugenda noroherwa",
      "Ndacyarwaye kandi ndarushaho kuremba",
      "Umurwayi yapfuye",
    ],
  },
  {
    id: 3,
    title:
      "Ese waba waragiye ahandi batanga serivisi z’ubuzima nyuma yo kujya ku mujyanama w’ubuzima?",
    type: QuestionType.RADIO,
    options: ["Yego", "Oya"],
    subQuestions: [
      {
        id: 101,
        parentId: 3,
        title: "Kuki wagiyeyo?",
        type: QuestionType.TEXT_INPUT,
        placeholder: "Andika hano",
        multiline: true,
        conditionalValue: "Yego",
      },
      {
        id: 102,
        parentId: 3,
        title: "Wagiye hehe?",
        type: QuestionType.TEXT_INPUT,
        placeholder: "Andika aho wagiye",
        multiline: true,
        conditionalValue: "Yego",
      },
      {
        id: 103,
        parentId: 3,
        title: "Wahawe ubuhe bufasha?",
        type: QuestionType.TEXT_INPUT,
        placeholder: "Andika aho wagiye",
        multiline: true,
        conditionalValue: "Yego",
      },
      {
        id: 104,
        parentId: 3,
        title: "Bakubwiye ikibazo cyangwa indwara wari urwaye?",
        type: QuestionType.RADIO,
        options: ["Yego", "Oya"],
        conditionalValue: "Yego",
      },
      {
        id: 105,
        parentId: 3,
        title: "Niba ari yego indwara yari iyihe?",
        type: QuestionType.TEXT_INPUT,
        placeholder: "Andika hano",
        conditionalValue: "Yego",
      },
      {
        id: 106,
        parentId: 3,
        title: "Ese ushobora kutwereka inyandiko wahawe ku bitaro?",
        type: QuestionType.RADIO,
        options: ["Yego", "Oya"],
        conditionalValue: "Yego",
      },
    ],
  },
  {
    id: 4,
    title: "Ubushobozi bwo kugenda",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Nta kibazo cyo kugenda mfite",
      "Mfite ingorane zidakomeye mu kugenda",
      "Mfite ikibazo gikomeye cyo kugenda",
      "Mfite ikibazo gikomeye cyane cyo kugenda.",
      "Sinshobora kugenda",
    ],
  },
  {
    id: 5,
    title: "Kwiyitaho",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Nta kibazo cyo kwisukura cyangwa kwiyambika mfite",
      "Mfite ikibazo gito cyo kwisukura cyangwa kwiyambika",
      "Mfite ikibazo gikomeye cyo kwisukura cyangwa kwiyambika",
      "Mfite ikibazo gikomeye cyane cyo kwisukura cyangwa kwiyambika",
      "Sinshobora kwisukura cyangwa kwiyambika",
    ],
  },
  {
    id: 6,
    title: "Imirimo isanzwe",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Nta kibazo mfite cyo gukora imirimo yanjye isanzwe (nk’akazi, kwiga, imirimo yo mu rugo, kwita ku muryango, kwidagadura)",
      "Mfite ikibazo kidakomeye cyo gukora ibikorwa byanjye bisanzwe",
      "Mfite ikibazo gikomeye cyo gukora ibikorwa byanjye bisanzwe",
      "Mfite ikibazo gikomeye cyane cyo gukora ibikorwa byanjye bisanzwe",
      "Sinshobora gukora ibikorwa byanjye bisanzwe",
    ],
  },
  {
    id: 7,
    title: "Ububabare/ Kumva udatekanye",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Nta bubabare mfite, ndatekanye",
      "Mfite ububabare buke, ntekanye gake",
      "Mfite ububabare bugereranije, ntabwo ntekanye neza.",
      "Mfite ububabare bwinshi, Sintekanye.",
      "Mfite ububabare bukabije cyane, Sintekanye namba",
    ],
  },
  {
    id: 8,
    title: "Imihangayiko / Agahinda",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Nta mihangayiko cyangwa agahinda mfite",
      "Mfite imihangayiko mike, agahinda gake",
      "Mfite imihangayiko igereranyije, agahinda kagereranyije",
      "Mfite imihangayiko ikomeye, agahinda gakomeye",
      "Mfite imihangayiko ikomeye cyane, agahinda gakomeye cyane",
    ],
  },
];

export const patientThoughtsQuestions: Question[] = [
  {
    id: 1,
    title: "Numvaga ntekanye ubwo ibiganiro byanjye byafatwaga amajwi",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Ndabyemeye cyane",
      "ndabyemeye",
      "Ndifashe",
      "Simbyemeye",
      "Simbyemeye na gato",
    ],
  },
  {
    id: 2,
    title:
      "Gufatwa kw’amajwi ntibyabangamiye uburyo naganiraga n’Umujyanama w’Ubuzima, kuko numvaga nshobora kuvuga uko nshaka nubwo ibiganiro byafatwaga amajwi",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Ndabyemeye cyane",
      "ndabyemeye",
      "Ndifashe",
      "Simbyemeye",
      "Simbyemeye na gato",
    ],
  },
  {
    id: 3,
    title:
      "Gufata amajwi ibiganiro byanjye byatumye numva isuzuma ryanjye ririgukorwa neza kurushaho",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Ndabyemeye cyane",
      "ndabyemeye",
      "Ndifashe",
      "Simbyemeye",
      "Simbyemeye na gato",
    ],
  },
  {
    id: 4,
    title:
      "Gufatwa kw’amajwi nta ngaruka n’imwe byagize ku migendekere isanzwe y’isuzuma ryanjye.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Ndabyemeye cyane",
      "ndabyemeye",
      "Ndifashe",
      "Simbyemeye",
      "Simbyemeye na gato",
    ],
  },
];
