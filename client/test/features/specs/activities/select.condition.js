let selectCondition = (when, data)=>{
    when(/^he selects the first condition on (.*)/, (word) => {
        return new Promise((done) => {
            let row = data.vm.$el.querySelector('#condition div[name=NormalTableBody] table tr');
            let span = data.vm.$el.querySelector('#condition #conditions-wrapper');
            expect(condition.innerHTML).toContain(word)

            let window = condition.ownerDocument.defaultView;
            var click = new window.Event('click');
            Object.defineProperty(click, 'target', {writable: false, value: row});
            span.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        });
    });
}

module.exports = {
    selectCondition:selectCondition
}
