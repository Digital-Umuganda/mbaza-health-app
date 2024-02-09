export const helpData = [
  {
    title: "Nibagiwe PIN yanjye",
    description: `
Iyo wibagiwe PIN yawe:\n
1. Ujya aho kwinjirira,\n
2. kanda ahanditse:”Wibagiwe PIN?”, munsi yaho binjiriza PIN,\n
3. Andika nimero yawe ya telephone,\n
4. Kanda Ohereza,\n
nyuma yo kwinjiza nimero yawe ya telephone neza kandi iyo wandikishije muri system, uhita werekezwa aho kwinjiza kode wahame muri message.
5. Injiza kode, imwe wahawe muri message,\n
6, Injiza PIN nshyashya,\n
7. Kanda :”Emeza”\n
Iyo byakunze, uhita winjira muri system`,
    notes: `
Icyitonderwa: Ugomba kwinjiza neza nimero yawe na code kode wahawe muri message, utabikoze neza ntabwo wabona iyindi PIN.\n
Can the invalid verification code error be in english`,
  },

  {
    title: "Uko bakoresha iyi App",
    description: `
Iyi app irakoreshwa kugirango ifashe abajyanama b’ubuzima, mugutanga inama nziza kandi zikwiriye kubarwayi bahura nabo mukazi kabo kaburimunsi.
Gusa ibafasha kubona amakuru bibyiciro bitatu bitandukanye, hari:\n
1. Imirire mibi\n
2. Malaria\n
3. Igituntu\n
4. Umusonga
    `,
  },

  {
    title: "Uko biyandikisha muri App",
    description: `
1. Ujya kuri Google PlayStore\n
2. Ugashakisha App yitwa:”BAZA”,\n
3. Ukayi downloading\n
4. Ugakora installation\n
5. Ugafungura App\n
6. Kanda:”IYANDIKISHE”\n
7. Injizamo ibisabwa neza\n
Ibisabwa ni:
    ●	Amazina yanyu
    ●	Nimero ya telephone(07 …)
    ●	Hitamo aho mutuye:
        1. MUSANZE
        2. GICUMBI
        3. NYANZA
    ●	PIN uzajya winjiriraho\n
8. Kanda:”EMEZA”
`,
    notes: `Nusoza gukanda “EMEZA” urahita winjira muri App.`,
  },

  {
    title: `Uko binjira muri App`,
    description: `
1. Fungura App\n
2. Kanda:”INJIRA”\n
3. Injizamo ibisabwa neza\n
Ibisabwa ni:
    ●	Nimero ya telephone(07 …)
    ●	PIN\n
4. Kanda:”INJIRA”
    `,
    notes: `Nusoza gukanda “EMEZA” urahita winjira muri App.
Ninde ugenewe iyi App`,
  },

  {
    title: `Abagenewe iyi App ni`,
    description: `
1. Abakozi ba RBC\n
2. Abajyanama b’ubuzima\n
3. Abayikoraho\n
4. Ababiherewe uburenganzira nurwego rubishinzwe
    `,
  },
].sort((a, b) => a.title.localeCompare(b.title));
