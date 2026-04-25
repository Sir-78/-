package com.example.ninggaolv.controller;

import com.example.ninggaolv.model.Comment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommentController {
  private final Map<String, Comment> store = new LinkedHashMap<>();

  @GetMapping("/posts/{id}/comments")
  public List<Comment> list(@PathVariable String id) {
    return store.values().stream().filter(c -> id.equals(c.getPostId()))
      .sorted(Comparator.comparing(Comment::getTs)).collect(Collectors.toList());
  }

  @PostMapping("/posts/{id}/comments")
  public ResponseEntity<Comment> create(@PathVariable String id, @RequestBody Map<String,Object> body) {
    String cid = UUID.randomUUID().toString();
    String content = String.valueOf(body.get("content"));
    String nickName = body.containsKey("nickName") ? String.valueOf(body.get("nickName")) : "匿名";
    String avatarUrl = body.containsKey("avatarUrl") ? String.valueOf(body.get("avatarUrl")) : "";
    Comment c = new Comment(cid, id, content, nickName, avatarUrl, System.currentTimeMillis());
    store.put(cid, c);
    return ResponseEntity.status(201).body(c);
  }

  @DeleteMapping("/comments/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    store.remove(id);
    return ResponseEntity.noContent().build();
  }
}
