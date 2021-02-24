# -*- mode: makefile-gmake -*-
CFILES := $(wildcard *.c)
TARGETS := $(CFILES:%.c=%.wat)

.PHONY: all
all: $(TARGETS)

# Automatic detection of OS, assuming that you are not using Windows
UNAME_S := $(shell uname -s)

# !!! UGLY HACK WARNING !!!
# For MacOS X, we want to use the clang installed by homebrew llvm
ifeq ($(UNAME_S),Darwin)
	CLANG := /usr/local/opt/llvm/bin/clang
else
	CLANG := clang
endif


.PRECIOUS: %.wasm
%.wasm: %.c Makefile
  # Use -O1 instead of -Oz if you don't want clang to remove recursion so aggressively
	$(CLANG) --target=wasm32 --no-standard-libraries -Oz -g -Wl,--export-all -Wl,--no-entry -o $@ $<

%.wat: %.wasm
	wasm2wat $< --fold-expr -o $@

.PHONY: clean
clean:
	rm -f $(TARGETS) $(TARGET:%.wat=%.wasm)
