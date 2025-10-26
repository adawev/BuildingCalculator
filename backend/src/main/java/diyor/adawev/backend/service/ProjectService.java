package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.entity.*;
import diyor.adawev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CalculationRepository calculationRepository;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = Project.builder()
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : Project.ProjectStatus.DRAFT)
                .build();

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public ProjectResponse getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    public ProjectSummaryResponse getProjectSummary(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

        List<Calculation> calculations = calculationRepository.findByProjectIdOrderByCreatedAtDesc(projectId);

        if (calculations.isEmpty()) {
            return ProjectSummaryResponse.builder()
                    .projectId(project.getId())
                    .projectName(project.getName())
                    .roomCount(0)
                    .totalArea(0f)
                    .totalPipeLength(0f)
                    .totalMaterials(new ArrayList<>())
                    .rooms(new ArrayList<>())
                    .build();
        }

        float totalArea = 0f;
        float totalPipeLength = 0f;
        List<RoomSummary> rooms = new ArrayList<>();
        Map<String, MaterialSummary> materialMap = new HashMap<>();

        for (Calculation calc : calculations) {
            totalArea += calc.getRoomArea();
            totalPipeLength += calc.getPipeLength();

            rooms.add(RoomSummary.builder()
                    .calculationId(calc.getId())
                    .roomName(calc.getRoomName())
                    .roomArea(calc.getRoomArea())
                    .pipeLength(calc.getPipeLength())
                    .build());

            for (MaterialItem item : calc.getMaterialItems()) {
                String key = item.getMaterialType();
                MaterialSummary existing = materialMap.get(key);

                if (existing != null) {
                    existing.setQuantity(existing.getQuantity() + item.getQuantity());
                } else {
                    materialMap.put(key, MaterialSummary.builder()
                            .materialName(item.getMaterialName())
                            .quantity(item.getQuantity())
                            .unit(item.getUnit())
                            .type(item.getMaterialType())
                            .build());
                }
            }
        }

        List<MaterialSummary> totalMaterials = new ArrayList<>(materialMap.values());
        totalMaterials.sort(Comparator.comparing(MaterialSummary::getType));

        return ProjectSummaryResponse.builder()
                .projectId(project.getId())
                .projectName(project.getName())
                .roomCount(calculations.size())
                .totalArea(totalArea)
                .totalPipeLength(totalPipeLength)
                .totalMaterials(totalMaterials)
                .rooms(rooms)
                .build();
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
