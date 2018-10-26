# Running Jest Tests

* **Run tests every time before every push to the repository.**
* **Run tests before merging a code change into master.**

## Prepare:

To be able to run and write the tests, you'll first need to install the required packages.  

* Run the ```npm install``` command, and follow 
any output npm instructions to run subsequent installation commands for further installation of testing tools.

## Write:

1.  When you have a new UI component, create a new snapshot test for it.  Follow the tests in the 
```client/test/jest/ComponentSnapshotTests``` directory for examples to follow.  "Shallow" mounted test components 
are preferable to fully mounted components.
2. Write new snapshot tests to the ```client/test/jest/ComponentSnapshotTests``` directory.  
Note: some Jest (unit) tests are in the ```test/unit``` directory structure.

## Run:

* Run just the snapshot tests: 
```bash
     $ npm run jest jest/Component
```
> Jest looks for the directory structure matching ```jest/Component*``` and runs only the tests that exist in that directory.

> Running a new snapshot test for a new component will create a new snapshot.  **This snapshot has to be committed along
with the new test**, especially once we start running tests automatically before a build.

*  Run all jest tests:
```bash
     $ npm run jest
```
* Run all unit tests:
```bash
     $ npm run unit
```

## Update:

>### If there are test failures for existing snapshot tests:

* Carefully examine the test failure messages to see what changes broke the tests.  You should be able to see 
what exact part of the UI in the new snapshot does not match the existing snapshot.

* If the changes are valid, _i.e. you deliberately made the change_ that broke the test, for example a new class-name was added to a component, 
then update the snapshot by adding ```--- -u ``` to the test command:

```bash
     $ npm run jest -- -u jest/Component
```

* Commit the new snapshot along with the updated components or updated test.



