set(REVERSE_PROXY_SERVER_TARGET reverse-proxy-server)
set(SRC_LIST
    reverse-proxy-server.cpp
)

include_directories(${THIRD_PARTY_INCLUDES})
add_executable(${REVERSE_PROXY_SERVER_TARGET} ${SRC_LIST})
target_link_libraries(${REVERSE_PROXY_SERVER_TARGET} curl jsoncpp mongoose)
