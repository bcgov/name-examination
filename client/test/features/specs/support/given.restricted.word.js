import sinon from 'sinon'

let givenRestrictedWord = (given, data)=>{
    given(/^(.*) is a restricted word requiring consent with instructions: (.*)$/, (word, instructions) => {
        data.apiSandbox.postStub.withArgs('/api/v1/documents:restricted_words', sinon.match((value)=> value.content.indexOf(word)!=-1), sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                restricted_words_conditions: [
                    {
                        word_info: {
                            phrase: word
                        },
                        cnd_info: [
                            {
                                consent_required: 'Y',
                                instructions: instructions
                            }
                        ]
                    }
                ]
            } }))
        )
        data.apiSandbox.postStub.withArgs('/api/v1/documents:restricted_words', sinon.match((value)=> value.content.indexOf(word)==-1), sinon.match.any).returns(
            new Promise((resolve) => resolve({ data: {
                restricted_words_conditions: []
            } }))
        )
    });
}

module.exports = {
    givenRestrictedWord:givenRestrictedWord
}
