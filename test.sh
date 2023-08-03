cd NodeJS/
rm -rf ./test-report.xml && CI=true ./node_modules/.bin/jest --runInBand --testResultsProcessor ./node_modules/jest-junit-reporter --forceExit;
cd ../ReactJS/
rm -rf ./test-report.xml && CI=true ./node_modules/.bin/react-scripts test --verbose --env=jsdom --testResultsProcessor ./node_modules/jest-junit-reporter;