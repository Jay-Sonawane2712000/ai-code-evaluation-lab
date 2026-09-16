"""Placeholder CLI for inspecting an evaluation task directory."""

from pathlib import Path
import argparse


def score_task(task_path: Path) -> int:
    """Print basic task file information."""
    if not task_path.exists():
        print(f"Task path does not exist: {task_path}")
        return 1

    print(f"Task path: {task_path.resolve()}")
    print(f"README.md exists: {(task_path / 'README.md').exists()}")
    print(f"evaluation.md exists: {(task_path / 'evaluation.md').exists()}")
    print("Full test execution will be added in a later phase.")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Inspect a task directory for evaluation files."
    )
    parser.add_argument("task_path", help="Path to the task directory to inspect.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    return score_task(Path(args.task_path))


if __name__ == "__main__":
    raise SystemExit(main())
