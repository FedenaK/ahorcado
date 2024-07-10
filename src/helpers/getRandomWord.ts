let words: string[] = [
    'COMPUTADORA',
    'AGUACATE',
    'BANANA',
    'PERRO',
    'CELULAR',
    'VETERINARIO',
    'COMPUTACION',
    "UNIVERSIDAD",
    "TRANSFORMACION",
    "COMPRENSION",
    "REVOLUCION",
    "CONSTITUCION",
    "INFRAESTRUCTURA",
    "DESARROLLO",
    "INVESTIGACION",
    "MULTIDISCIPLINARIO",
    "RESPONSABILIDAD",
    "HIPOPOTAMO",
    "PROBLEMATICA",
    "MATEMATICA",
    "COMPILACION",
    "ESDRUJULA",
    "EQUILATERO",
    "BICICLETA",
    "MULTIMILLONARIO",
    "ORDINARIO",
    "GUITARRISTA",
    "XILOFON",
    "LABORATORIO",
    "SUAVEMENTE",
    "AUTOMOVIL",
    "AUTOMATIZACION",
    "IMPRESCINDIBLE",
    
];




export function getRandomWord() {
   
    const getRandomWord = async (): Promise<string | null> => {
        try {
          const response = await fetch('https://api.example.com/randomword');
          const data = await response.json();
          if (typeof data.word === 'string' ? data.word : String(data.word)) {
            return data.word;
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error('Error fetching the word:', error);
          return null;
        }
      };
      
    
   // const randomIndex = Math.floor( Math.random() * words.length );
   // return words[randomIndex];

};
