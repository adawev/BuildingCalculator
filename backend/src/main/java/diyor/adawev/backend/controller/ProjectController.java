package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.service.PdfService;
import diyor.adawev.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ProjectSummaryResponse> getProjectSummary(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectSummary(id));
    }

    @GetMapping("/{id}/summary/pdf")
    public ResponseEntity<byte[]> getProjectSummaryPdf(@PathVariable Long id) throws IOException {
        byte[] pdfBytes = pdfService.generateProjectSummaryPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "project_" + id + "_summary.pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
