package com.example.ninggaolv.controller;

import com.example.ninggaolv.model.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {
  private final Map<String, Post> store = new LinkedHashMap<>();

  @GetMapping
  public Map<String,Object> list(@RequestParam(required = false) String user,
                                 @RequestParam(defaultValue = "0") Integer page,
                                 @RequestParam(defaultValue = "20") Integer size) {
    List<Post> all = new ArrayList<>(store.values());
    List<Post> filtered = all.stream().collect(Collectors.toList());
    filtered.sort(Comparator.comparing(Post::getDate, Comparator.nullsLast(Long::compare)).reversed());
    int from = Math.max(0, page * size);
    int to = Math.min(filtered.size(), from + size);
    List<Post> content = from >= filtered.size() ? new ArrayList<>() : filtered.subList(from, to);
    return Map.of("content", content, "page", page, "size", size, "total", filtered.size());
  }

  @PostMapping
  public ResponseEntity<Post> create(@RequestBody Post req) {
    String id = req.getId() != null ? req.getId() : UUID.randomUUID().toString();
    Post p = new Post(id, req.getType() != null ? req.getType() : "normal", req.getContent(), req.getImages(),
      req.getDate() != null ? req.getDate() : System.currentTimeMillis(),
      req.getLikes() != null ? req.getLikes() : 0);
    store.put(id, p);
    return ResponseEntity.status(201).body(p);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Post> update(@PathVariable String id, @RequestBody Map<String,Object> patch) {
    Post p = store.get(id);
    if (p == null) return ResponseEntity.notFound().build();
    if (patch.containsKey("content")) p.setContent(String.valueOf(patch.get("content")));
    if (patch.containsKey("images")) p.setImages((List<String>) patch.get("images"));
    store.put(id, p);
    return ResponseEntity.ok(p);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    store.remove(id);
    return ResponseEntity.noContent().build();
  }
}
