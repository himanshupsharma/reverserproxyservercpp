#!/bin/bash

#Ensure WORKSPACE is set
if [ -z ${WORKSPACE} ]; then
    echo "Please set WORKSPACE to root directory path for reverse-proxy-server."
    exit 1
fi

getOpenPort()
{
    read lowerPort upperPort < /proc/sys/net/ipv4/ip_local_port_range
    for (( port = lowerPort ; port <= upperPort ; )); do
        number=$RANDOM
        let "number %= 100"
        let "port += $number"
        nc -z localhost $port
        if [ $? -eq 1 ]; then
            echo ${port}
            exit 0
        fi
    done
    exit 1
}

createTempDir()
{
    #Second part is for OSX
    tmpdir=`mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir'`
    echo ${tmpdir}
    exit 1
}


# Create temporary reverse-proxy-mappings file with a port/URL  
temp_dir=$(createTempDir)
echo_server_port=$(getOpenPort)
echo "{\"/test\": \"${echo_server_port}\"}" > ${temp_dir}/reverse-proxy-mappings.json

shutdown()
{
    local pids=$(jobs -pr)
    [ -n "$pids" ] && kill $pids
    rm -rf ${temp_dir} > /dev/null 2>&1
    #Give some time for kill & rm to work
    sleep 2
}

#To ensure that we clean up for abrupt exits
trap "exit" SIGINT SIGTERM
trap shutdown EXIT

reverse_proxy_server_port=$(getOpenPort)
${WORKSPACE}/build/src/reverse-proxy-server -f ${temp_dir}/reverse-proxy-mappings.json -p ${reverse_proxy_server_port} > /dev/null 2>&1 &
${WORKSPACE}/build/tests/testechowebserver ${echo_server_port} > /dev/null 2>&1 &

nodejs ${WORKSPACE}/tests/verify_webserver.js ${reverse_proxy_server_port}
if [ $? -ne 0 ]; then
    echo "FAILURE"
    exit 1
fi

echo "SUCCESS"

