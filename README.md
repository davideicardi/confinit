# confinit

Application configuration helpers for Node.Js

This module allow any Node.js application to read configuraiton from:

- environment variables (with a specifiec prefix)
- config json file
- command line (using `--section_property=value` syntax)

## Usage (typescript)

Installation

    npm install confinit

Import `confinit`

    import * as confinit from "confinit";

Define a configuration class with one or more section:

    export class Section1Config {
      url: string = "";
    }

    export class Configuration {
      readonly section1 = new Section1Config();

      constructor() {
        const env = process.env;
        // load config from configuration file
        if (env.config) {
          const configFile = path.resolve(process.cwd(), env.config);
          confinit.applyConfigFile(this, configFile);
        }
        // load config from environment variables
        confinit.applyEnvVariables(this, process.env, "cfg_");
        // load config from command line
        confinit.applyCommandArgs(this, process.argv);
      }
    }

Then just use your configuraiton class:

    const config = new Configuration();
    console.log(config.section1);

## Sample app

Read configuration from config file:

    config=./sample/config1.json node ./sample/

or

    node ./sample/ --config=./sample/config1.json

Read configuration from environment variables:

    cfg_section1_url=http://test.com node ./sample/

Read configuration from command arguments:

    node ./sample/ --section1_url=http://myotherurl.com

    node ./sample/ --section1_url=http://myotherurl.com --webServer_port=8040
