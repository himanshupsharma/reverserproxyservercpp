project(reverseproxyservercpp)
cmake_minimum_required(VERSION 2.8)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(THIRD_PARTY_INCLUDES "${CMAKE_CURRENT_SOURCE_DIR}/third-party/json-cpp"
                            "${CMAKE_CURRENT_SOURCE_DIR}/third-party/mongoose")

add_subdirectory(src)
add_subdirectory(third-party/json-cpp)
add_subdirectory(third-party/mongoose)
add_subdirectory(tests)
