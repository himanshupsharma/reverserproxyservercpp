project(mongoose)
cmake_minimum_required(VERSION 2.8)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

include_directories(
)

set(SRC_LIST
    mongoose.c
)

add_library(${PROJECT_NAME} SHARED ${SRC_LIST})

