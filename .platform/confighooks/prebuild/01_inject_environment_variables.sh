#!/bin/bash

# This function allows log errors messages in stderr
# By default, all echo output will be sent to stdout which is treated as function output.
function log_error { echo "[$(date "+%F %T %Z")] [ERROR] ${1}" >> /dev/stderr; }

# This function allows log debug messages in stderr 
# By default, all echo output will be sent to stdout which is treated as function output.
function log_info { echo "[$(date "+%F %T %Z")] [INFO] ${1}" >> /dev/stderr; }

# This function get PM environment variables
function get_pm_environment_variables {

    log_info "Fetch environment variables starting with PM_ ..."

    # Fetch all the environment variables starting with PM_
    local blacklist_variables_pattern="^SENTRY_AUTH_TOKEN|^SENTRY_DEPLOY_TOKEN"
    local pm_env_variables=$(printenv | grep -vE "${blacklist_variables_pattern}" | grep -E "^PM_|^CLIENT_|^SENTRY_")
    
    local no_pm_env_variables=$(echo "${pm_env_variables}" | wc -l | xargs)
    log_info "${no_pm_env_variables} variables found"

    echo "${pm_env_variables}"
    return 0
}

# This function does regex match against given string
function regex_match { 
    local string=${1}
    local regex=${2}

    shift 2
    local match_indexes=("$@")

    if [[ ${string} =~ ${regex} ]]; then 
        if [[ -z "${match_indexes}" ]]; then
            echo "${BASH_REMATCH[0]}"
            return 0
        fi

        matched_groups=()
        for match_idx in "${match_indexes[@]}"; do
            matched_groups+=("${BASH_REMATCH[${match_idx}]}")
        done

        echo "${matched_groups[@]}"
        return 0
    fi

    log_info "Not Match: ${regex} against string: ${string} ..."
    return 1
}

# This function transform key-value pair into json string
function transform_key_value_pair_to_json {

    log_info "Transform key-value pair environment variables into json ..."

    local key_value_pair=${1}

    local key_value_pattern="([A-Za-z0-9_]+)(=)(.+)"

    # Starting with opening curly bracket "{"
    local json_string="{"

    while IFS= read -r line; do
        

        # Parse key and value from the string
        local group_indexes=(1 3)
        local key_value=($(regex_match ${line} ${key_value_pattern} "${group_indexes[@]}"))
        if [[ $? -ne 0 ]]; then
            log_error "Variable failed to comply to the regex: ${key_value_pattern}"
            return 1
        fi

        log_info "Processing key: ${key_value[0]}"
        
        json_string="${json_string}\"${key_value[0]}\": \"${key_value[1]}\", "
        
    done <<< "${key_value_pair}"

    # Remove the trailing ", "
    json_string="${json_string%, }"

    # Adding closing curly bracket "}"
    json_string="${json_string}}"
    

    log_info "Transformed key-value pair environment variables into json!"

    echo ${json_string}
    return 0
}

# This function inject json string into application by replacing content
# in javascript file
function inject_environment_variables_in_application {
    
    local base_path="/var/app/staging"
    local pm_env_variables=${1}
    local placeholder="__RUNTIME_PM_ENVIRONMENTS__"
    local filename="environment.js"
    local source_file_path="${base_path}/server/${filename}"
    local target_file_path="${base_path}/build/life/${filename}"

    if [[ ! -e "${target_file_path}" ]]; then
        log_info "File not found: ${target_file_path}, Creating ..."
        touch "${target_file_path}"
    fi

    # Copy the file content in the bundle
    log_info "Copying file content from ${source_file_path} to ${filename}"
    if ! cat "${source_file_path}" > "${target_file_path}"; 
    then
        log_error "Failed to copy content of file: ${source_file_path} to ${target_file_path}"
        return 1        
    fi

    # To run this script on mac replace --in-place with -i.bak
    log_info "Injecting variables ..."
    if ! sed --in-place "s#${placeholder}#${pm_env_variables}#g" "${target_file_path}"; then
        log_error "Failed to inject variables s/${placeholder}/${pm_env_variables}/g in file: ${target_file_path}"
        return 2
    fi

    local variable_count=$(echo ${pm_env_variables} | jq "length")
    log_info "Injected ${variable_count} environment variables in the application!"
}

function main {

    log_info "Injecting environment variables in the application ..."

    local pm_env_variables=$(get_pm_environment_variables)
    if [[ $? -ne 0 ]]; then
        log_error "Failed to read the environment variables"
        exit 1
    fi


    if ! pm_env_variables=$(transform_key_value_pair_to_json "${pm_env_variables}");
    then
        log_error "Failed to transform environment variables into json"
        exit 2
    fi


    if ! inject_environment_variables_in_application "${pm_env_variables}"; 
    then
        log_error "Failed to inject environment variables into application"
        exit 2
    fi

    exit 0
}

main
