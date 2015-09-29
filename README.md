#Description
C++ based reverse proxy server.
Reverse Proxy server helps retrieving resources for a client from one or more backend webservers.
It works as a single-entry interface of a system running multiple servers internally.

## Building
    export WORKSPACE=<path-to-downloaded-directory>
    cd ${WORKSPACE}
    mkdir build
    cd build
    cmake ..
    make 

## Running
   ${WORKSPACE}/build/src/reverse-proxy-server -f mapping-file 

    where mapping-file is a simple JSON file providing the mapping of URL and port number of back-end server. Here is an example:
        {
            "first" : "2000",
            "second": "2001"
        }

## Dependencies
    This Reverse Proxy Server has been built using Mongoose and json-cpp. Please adjust root-level CMakeLists.txt file if you want to reuse your own version of these dependencies.

## Running tests
    ${WORKSPACE}/tests/test.sh
