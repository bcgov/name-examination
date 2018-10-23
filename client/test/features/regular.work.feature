Feature: Chain approval

Scenario: Joe can chain approval of several requests
    Given INSURANCE is a restricted word requiring consent with instructions: double check please

    Given Joe has an INPROGRESS assigned name request NR1111 with name INSURANCE & Co INC
    Given Joe accesses Name examination
    Given he accesses conditions tab
    Given he selects the first condition on INSURANCE
    When he goes to Decision screen
    Then he sees the selected condition about INSURANCE - double check please
    When he approves NR1111
    Then he sees that NR1111 is now APPROVED

    Given Joe has an INPROGRESS assigned name request NR2222 with name Dev & Co INC
    Given Joe accesses the next examination
    When he goes to Decision screen
    Then he sees conditions list is empty
    When he approves NR2222
    Then he sees that NR2222 is now APPROVED
