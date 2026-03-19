// RUNTIME_PM_ENVIRONMENTS is replaced with a json object containing the environment variables during bootstrapping application. 
// This is done by .platform/hooks/prebuild/01_inject_environment_variables.sh script
if (window !== undefined){
    window["ENVIRONMENT_VARIABLES"] = __RUNTIME_PM_ENVIRONMENTS__
}
