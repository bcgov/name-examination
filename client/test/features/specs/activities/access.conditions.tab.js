let accessConditionsTab = (when, data)=>{
    when(/^he accesses conditions tab$/, (userId) => {
        return new Promise((done) => {
            let button = data.vm.$el.querySelector('#conditions-tab');
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
    accessConditionsTab:accessConditionsTab
}
