App was created from CRA with typescript template.

To make styles i prefer `styled-components`.

I didn't use `semantic-ui` before, but i use it in this app.

To start app install node modules using `npm i` and then just use `npm start`.

I didn't find valid VAT library without dependencies, so you should start node service with express and `validate-vat` node libraries.
To start server just use `node server` or `npm run start:server`.

Time used 4 hours (1.5 hours i used to find VAT validation lib without paid services or using another server).

Valid VAT example for Portugal is `501413197`

Possible improvements:
1. Validation messages with absolute positioning.
2. Use paid and stable service to validate VAT IDs.
3. Store billing and countries data in redux or mobx (doesn't have sense for such small app).
4. Add form managing libraries (formik, react-hooks-forms)
5. Custom ts and js configs without CRA (i have one at one of my repositories: "exchange-app" and "team-cards")
6. Tests
7. Modal closing button (now it closes by clicking on white space outside of form or `escape` character)
8. Add error handling to api calls

PS: Add VAT validation lib or service link to help finish this task to other canditates.