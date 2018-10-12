Feature: Quick approve

Scenario: Joe can quickly approve the next examination assigned to him
    Given Joe accesses Name examination
    When Joe quickly approves the presented name
    Then Joe sees that the request is now approved
