Feature: Quick approve

Scenario: Joe can quickly approve the next examination assigned to him
    Given Joe has an INPROGRESS assigned name request NR1234
    When Joe accesses Name examination
    Then he sees that he can quickly approve NR1234

    When he quickly approves NR1234
    Then he sees that NR1234 is now APPROVED

Scenario: Max can not quickly approve examination assigned to Joe
    Given Joe has an INPROGRESS assigned name request NR1234
    When Max accesses Name examination
    Then he sees that he can NOT quickly approve NR1234
