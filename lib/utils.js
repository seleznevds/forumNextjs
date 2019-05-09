//возвращает форму  существительного в зависимости от числительного
export const getWordForm = (number, wordForms) => {
    let rest = number % 100;

    if(rest >= 11 &&  rest <= 19){
        return wordForms.plural;
    }

    rest = rest % 10;

    if (rest === 0 || rest >=5){
        return wordForms.plural;
    }

    if(rest >=2){
        return wordForms.genitive;
    }

    return wordForms.nominative;
}


export const getUniqueCollectionByProp = (collection, prop) => {
    let propValues = [];
    collection = collection.filter(element => {
      if (propValues.indexOf(element[prop]) === -1) {
        propValues.push(element[prop]);
        return true;
      }
      return false;
    });

    return collection;

  }