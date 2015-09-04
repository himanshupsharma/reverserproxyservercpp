set(SOURCES
    TestWebserver.cpp
)

set(ECHOWEBSERVER_TEST testechowebserver)
include_directories(${THIRD_PARTY_INCLUDES})
add_executable(${ECHOWEBSERVER_TEST} ${SOURCES})
target_link_libraries(${ECHOWEBSERVER_TEST} jsoncpp mongoose)
