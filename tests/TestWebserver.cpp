#include <stdio.h>
#include <string.h>
#include <iostream>

#include "mongoose.h"
#include <json.h>

using namespace std;

static int ev_handler(struct mg_connection *conn, enum mg_event ev) {
  switch (ev) {
    case MG_AUTH: return MG_TRUE;
    case MG_REQUEST:
        {
            if( (strstr(conn->uri, "/first") != conn->uri) &&
                (strstr(conn->uri, "/second/") != conn->uri) )
                    return MG_FALSE;
            Json::Value value;
            value["method"] = conn->request_method;
            value["uri"] = conn->uri + ( (conn->query_string) ? std::string("?") + conn->query_string : "");
            std::string s("");
            if(conn->content_len) {
                s.resize(conn->content_len);
                memcpy(&s[0], conn->content, s.size());
            }
            value["body"] = s;

            for(auto i = 0; i < conn->num_headers; ++i) {
                //Only echo custom headers
                if(!strncmp(conn->http_headers[i].name, "X-", 2))
                    mg_send_header(conn, conn->http_headers[i].name, conn->http_headers[i].value);
            }

            mg_send_status(conn, 200);
            mg_printf_data(conn, "%s", Json::FastWriter().write(value).c_str());
        }
 
      return MG_TRUE;
    default: return MG_FALSE;
  }
}

int main(int argc, char* argv[]) {
  struct mg_server *server;

  // Create and configure the server
  server = mg_create_server(NULL, ev_handler);
  mg_set_option(server, "listening_port", argv[1]);

  // Serve request. Hit Ctrl-C to terminate the program
  printf("Starting on port %s\n", mg_get_option(server, "listening_port"));
  for (;;) {
    mg_poll_server(server, 1000);
  }

  // Cleanup, and free server instance
  mg_destroy_server(&server);

  return 0;
}

