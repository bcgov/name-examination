let whenSomeoneSelectTheCondition = (when, data)=>{
    when(/^he selects the first condition on (.*)/, (word) => {
        return new Promise((done) => {
            let condition = data.vm.$el.querySelector('#condition div[name=NormalTableBody] table tr');
            expect(condition.innerHTML).toContain(word)
            
            let window = condition.ownerDocument.defaultView;
            var click = new window.Event('click');
            condition.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        });
    });
}

module.exports = {
    whenSomeoneSelectTheCondition:whenSomeoneSelectTheCondition
}
