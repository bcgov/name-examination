let whenSomeoneGoesToDecisionScreen = (when, data)=>{
    when(/^he goes to Decision screen$/, (userId) => {
        return new Promise((done) => {
            let button = data.vm.$el.querySelector('#examine-decide-button');
            expect(button).not.toEqual(null)
            let window = button.ownerDocument.defaultView;
            var click = new window.Event('click');
            button.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        });
    });
}

module.exports = {
    whenSomeoneGoesToDecisionScreen:whenSomeoneGoesToDecisionScreen
}
