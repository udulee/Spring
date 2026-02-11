package lk.ijse.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/request")
public class RequestController {

    @PostMapping
    public String post(@RequestHeader("Authorization") String autherization,@RequestHeader("token")  String token) {
        return "Hello World!- index: \n Autherization: "+autherization +" \n Token: "+ token;
    }

    @PostMapping("querystring")
    public String getQueryStringParameters(@RequestParam("id") String id,
                                           @RequestParam("name") String name,
                                           @RequestParam("address") String address) {
        return "Hello World!- querystring"+"\n ID: "+id+"\n Name: "+name+"\n Address: "+address;
    }
    @PostMapping("pathvariable/{name}/{address}")
    public String getPathVariable(@PathVariable("name") String names,@PathVariable("address") String address) {
        return "Hello World!- pathVariable:"+names+"\n Address: "+address;
    }
}
